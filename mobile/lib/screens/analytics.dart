import 'package:flutter/material.dart';
import 'package:usafes/services/responses/analytics.dart';

class Analytics extends StatelessWidget {
  final AnalyticsResponse? analytics;

  const Analytics({Key? key, required this.analytics}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (analytics == null) {
      return Container();
    }

    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.3),
            blurRadius: 30,
            spreadRadius: 0.5,
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.only(top: 12.0),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.only(
              left: 4.0,
              right: 4.0,
              top: 8.0,
              bottom: 4.0,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ListTile(
                  leading: const Icon(Icons.event_outlined),
                  title: Text('Academic Year: ${analytics!.academicYear.year}'),
                  subtitle: Column(
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(analytics!.academicYear.semester),
                      ),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Evaluation Status: ${analytics!.academicYear.status}',
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
