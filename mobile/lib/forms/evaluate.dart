import 'package:flutter/cupertino.dart';
import 'package:usafes/forms/base_form.dart';
import 'package:usafes/interfaces/form_controller_interface.dart';

class EvaluateForm extends BaseForm implements FormControllerInterface {
  final comments = TextEditingController();
  int facultyId = 0;
  Map<int, int> answers = {};

  @override
  final List<String> errorKeys = [
    'faculty_id',
    'answers',
    'comments',
  ];

  @override
  void dispose() {
    comments.dispose();
    facultyId = 0;
    answers = {};
  }

  void clear() {
    comments.clear();
    facultyId = 0;
    answers = {};
  }

  @override
  Map<String, dynamic> toObject() {
    return {
      'comments': comments.text.trim(),
      'faculty_id': facultyId > 0 ? facultyId : null,
      'answers': answers
          .map(
            (questionId, answer) => MapEntry(questionId, {
              'question_id': questionId,
              'rating': answer,
            }),
          )
          .values
          .toList(),
    };
  }
}
