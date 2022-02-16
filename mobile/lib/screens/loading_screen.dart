import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:usafes/components/shared/logo.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => LoadingScreenState();
}

class LoadingScreenState extends State<LoadingScreen> {
  @override
  void initState() {
    super.initState();

    Uri url = Uri.parse(dotenv.env['SERVER_URL']! + '/sanctum/csrf-cookie');

    http.get(url, headers: {'Accept': 'application/json'}).then((response) {
      Navigator.of(context).pushNamed('/');
    });
  }

  @override
  Widget build(BuildContext context) {
    return const SafeArea(
      child: Scaffold(
        body: Center(
          child: Logo(),
        ),
      ),
    );
  }
}
