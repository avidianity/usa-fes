import 'package:flutter/material.dart';
import 'package:usafes/forms/evaluate.dart';
import 'package:usafes/services/faculty.dart';

class Faculty {
  final String title;
  final int id;

  Faculty({
    required this.title,
    required this.id,
  });
}

class Evaluate extends StatefulWidget {
  const Evaluate({Key? key}) : super(key: key);

  @override
  _EvaluateState createState() => _EvaluateState();
}

class _EvaluateState extends State<Evaluate> {
  final facultyService = FacultyService();
  final controller = EvaluateForm();
  List<Faculty> faculties = [
    Faculty(
      title: '-- Select --',
      id: 0,
    )
  ];

  @override
  void initState() {
    super.initState();

    fetchFaculties();
  }

  Future<void> fetchFaculties() async {
    final faculties = await facultyService.fetch();
    setState(() {
      this.faculties = [
        Faculty(
          title: '-- Select --',
          id: 0,
        ),
        ...faculties
            .map(
              (faculty) => Faculty(
                  title: '${faculty.lastName}, ${faculty.firstName}',
                  id: faculty.id),
            )
            .toList(),
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 12, left: 8, right: 8),
      child: ListView(
        shrinkWrap: true,
        physics: const ClampingScrollPhysics(),
        children: [
          DropdownButtonFormField<int>(
            isExpanded: true,
            decoration: InputDecoration(
              border: const UnderlineInputBorder(),
              icon: const Icon(Icons.supervised_user_circle_outlined),
              labelText: 'Faculty',
              errorText: controller.hasError('faculty_id')
                  ? controller.getError('faculty_id').join('\n')
                  : null,
            ),
            style: const TextStyle(fontSize: 14, color: Colors.black),
            value: controller.facultyId,
            onChanged: (int? id) {
              if (id != null) {
                setState(() {
                  controller.facultyId = id;
                });
              } else {
                setState(() {
                  controller.facultyId = 0;
                });
              }
            },
            items: faculties
                .map(
                  (faculty) => DropdownMenuItem<int>(
                    value: faculty.id,
                    child: Text(faculty.title),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}
