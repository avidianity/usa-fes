import 'package:flutter/material.dart';
import 'package:usafes/components/criteria.dart';
import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/exceptions/http/internal_server_error.dart';
import 'package:usafes/exceptions/http/validation.dart';
import 'package:usafes/forms/evaluate.dart';
import 'package:usafes/models/criteria.dart';
import 'package:usafes/services/criteria.dart';
import 'package:usafes/services/evaluation.dart';
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
  final criteriaService = CriteriaService();
  final evaluationService = EvaluationService();
  final controller = EvaluateForm();
  List<Faculty> faculties = [
    Faculty(
      title: '-- Select --',
      id: 0,
    )
  ];

  List<CriteriaModel> criterias = [];

  @override
  void initState() {
    super.initState();

    fetchCriterias();
    fetchFaculties();
  }

  Future<void> submit() async {
    final payload = controller.toObject();

    try {
      await evaluationService.store(payload);
      setState(() {
        controller.clear();
        controller.clearErrors();
      });

      final snack = SnackBar(
        content: const Text('Evaluation saved successfully!'),
        backgroundColor: Colors.green,
        action: SnackBarAction(
          label: 'Dismiss',
          textColor: Colors.white,
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      );

      ScaffoldMessenger.of(context).showSnackBar(snack);
    } on ValidationException catch (exception) {
      setState(() {
        controller.setErrors(exception.getErrors());

        if (controller.hasError('answers')) {
          final snack = SnackBar(
            content: const Text('Please answer all of the questions.'),
            backgroundColor: Colors.red[400],
            action: SnackBarAction(
              label: 'Dismiss',
              textColor: Colors.white,
              onPressed: () {
                ScaffoldMessenger.of(context).hideCurrentSnackBar();
              },
            ),
          );

          ScaffoldMessenger.of(context).showSnackBar(snack);
        }
      });
    } on InternalServerErrorException catch (exception) {
      _showSnackException(exception: exception, color: Colors.red[400]);
    }
  }

  _showSnackException({
    required HttpException exception,
    Color? color,
    Color? actionColor,
  }) {
    final snack = SnackBar(
      content: Text(exception.message),
      backgroundColor: color,
      action: SnackBarAction(
        label: 'Dismiss',
        textColor: actionColor,
        onPressed: () {
          ScaffoldMessenger.of(context).hideCurrentSnackBar();
        },
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snack);
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

  Future<void> fetchCriterias() async {
    final criterias = await criteriaService.fetch();
    setState(() {
      this.criterias = criterias;
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
          const SizedBox(
            height: 12,
          ),
          ...criterias
              .map(
                (criteria) => Criteria(
                  criteria: criteria,
                  onAnswer: (questionId, answer) {
                    setState(() {
                      controller.answers[questionId] = answer;
                    });
                  },
                  answers: controller.answers,
                ),
              )
              .toList(),
          const SizedBox(
            height: 12,
          ),
          TextField(
            controller: controller.comments,
            maxLines: 2,
            decoration: InputDecoration(
              border: const OutlineInputBorder(),
              labelText: 'Comments',
              errorText: controller.hasError('comments')
                  ? controller.getError('comments').join('\n')
                  : null,
              icon: const Icon(
                Icons.comment_outlined,
              ),
            ),
          ),
          const SizedBox(
            height: 18,
          ),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                submit();
              },
              child: const Text('Submit'),
            ),
          ),
          const SizedBox(
            height: 40,
          ),
        ],
      ),
    );
  }
}
