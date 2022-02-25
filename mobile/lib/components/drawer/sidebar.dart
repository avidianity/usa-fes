import 'package:flutter/material.dart';
import 'package:usafes/components/dashboard.dart';
import 'package:usafes/components/drawer/header.dart';
import 'package:usafes/models/user.dart';

class Sidebar extends StatelessWidget {
  final UserModel user;
  final Function(BuildContext context) logout;
  final Function(String route) onRouteChange;
  final String currentRoute;
  const Sidebar({
    Key? key,
    required this.user,
    required this.logout,
    required this.onRouteChange,
    required this.currentRoute,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          Header(user: user),
          ListTile(
            selected: currentRoute == routeAnalytics,
            leading: const Icon(Icons.trending_up_outlined),
            title: const Text('Analytics'),
            onTap: () {
              onRouteChange(routeAnalytics);
              Navigator.pop(context);
            },
          ),
          ListTile(
            selected: currentRoute == routeEvaluate,
            leading: const Icon(Icons.check_box_outlined),
            title: const Text('Evaluate'),
            onTap: () {
              onRouteChange(routeEvaluate);
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout_outlined),
            title: const Text('Logout'),
            onTap: () async {
              final result = await showDialog<bool>(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        title: const Text('Logout'),
                        content: const Text(
                          'Are you sure you want to logout?',
                        ),
                        actions: [
                          ElevatedButton(
                            onPressed: () {
                              Navigator.of(context).pop(true);
                            },
                            child: const Text('Confirm'),
                          ),
                          ElevatedButton(
                            style: ButtonStyle(
                              backgroundColor: MaterialStateProperty.all<Color>(
                                Colors.redAccent,
                              ),
                            ),
                            onPressed: () {
                              Navigator.of(context).pop(false);
                            },
                            child: const Text('Cancel'),
                          ),
                        ],
                      );
                    },
                  ) ??
                  false;

              if (result) {
                Navigator.of(context).pop();
                logout(context);
              }
            },
          ),
        ],
      ),
    );
  }
}
