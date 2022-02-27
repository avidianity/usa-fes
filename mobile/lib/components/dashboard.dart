import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/components/drawer/sidebar.dart';
import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/exceptions/invalid_route.dart';
import 'package:usafes/http/client.dart';
import 'package:usafes/models/user.dart';
import 'package:usafes/screens/analytics.dart';
import 'package:usafes/screens/evaluate.dart';
import 'package:usafes/services/analytics.dart';
import 'package:usafes/services/auth.dart';
import 'package:usafes/services/responses/analytics.dart';

const routeAnalytics = '/';
const routeEvaluate = '/evaluate';

class Dashboard extends StatefulWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final storage = const FlutterSecureStorage();
  final http = Client();
  final analyticsService = AnalyticsService();
  final authService = AuthService();
  String currentRoute = routeAnalytics;
  AnalyticsResponse? analytics;

  @override
  void initState() {
    super.initState();

    checkUser();
    fetchAnalytics();
  }

  fetchAnalytics() async {
    final analytics = await analyticsService.fetch();
    setState(() {
      this.analytics = analytics;
    });
  }

  changeRoute(String route) {
    setState(() {
      currentRoute = route;
    });
  }

  checkUser() async {
    try {
      final user = await authService.check();
      storage.write(key: 'user', value: user.toJson()).then((value) {
        setState(() {
          //
        });
      });
    } catch (_) {
      await storage.delete(key: 'token');
      await storage.delete(key: 'user');

      Navigator.pushNamedAndRemoveUntil(context, '/', (_) => false);
    }
  }

  logout(BuildContext context) async {
    final token = await storage.read(key: 'token');

    if (token == null) {
      return;
    }

    try {
      await http.delete('/api/auth/logout', headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer $token'
      });
    } on HttpException catch (_) {
    } finally {
      await storage.delete(key: 'user');
      await storage.delete(key: 'token');

      const snack = SnackBar(
        content: Text('Logged out successfully!'),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      );

      ScaffoldMessenger.of(context).showSnackBar(snack);

      Navigator.pushNamedAndRemoveUntil(context, '/', (_) => false);
    }
  }

  Widget buildRoute() {
    switch (currentRoute) {
      case routeAnalytics:
        return Analytics(
          analytics: analytics,
        );
      case routeEvaluate:
        return const Evaluate();
      default:
        throw InvalidRouteException();
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<dynamic>(
      future: storage.read(key: 'user'),
      builder: (BuildContext context, AsyncSnapshot<dynamic> snapshot) {
        if (snapshot.data == null) {
          return const Text('');
        }

        final user = UserModel.fromJson(jsonDecode(snapshot.data));

        return SafeArea(
          child: Scaffold(
            appBar: AppBar(),
            drawer: Sidebar(
              user: user,
              logout: logout,
              currentRoute: currentRoute,
              onRouteChange: (String route) {
                changeRoute(route);
              },
            ),
            body: RefreshIndicator(
              onRefresh: () async {
                checkUser();
                fetchAnalytics();
              },
              child: ListView(
                padding: const EdgeInsets.all(8),
                children: [buildRoute()],
              ),
            ),
          ),
        );
      },
    );
  }
}
