import 'package:flutter/cupertino.dart';
import 'package:usafes/forms/base_form.dart';
import 'package:usafes/interfaces/form_controller_interface.dart';

class RegisterForm extends BaseForm implements FormControllerInterface {
  final schoolId = TextEditingController();
  int sectionId = 0;
  final firstName = TextEditingController();
  final lastName = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  final passwordConfirmation = TextEditingController();

  @override
  final List<String> errorKeys = [
    'school_id',
    'section_id',
    'first_name',
    'last_name',
    'email',
    'password',
    'picture',
  ];

  @override
  void dispose() {
    schoolId.dispose();
    firstName.dispose();
    lastName.dispose();
    email.dispose();
    password.dispose();
    passwordConfirmation.dispose();
    sectionId = 0;
  }

  @override
  Map<String, dynamic> toObject() {
    return {
      'school_id': schoolId.text.trim(),
      'section_id': sectionId > 0 ? sectionId : null,
      'first_name': firstName.text.trim(),
      'last_name': lastName.text.trim(),
      'email': email.text.trim(),
      'password': password.text.trim(),
      'password_confirmation': passwordConfirmation.text.trim()
    };
  }
}
