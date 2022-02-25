import 'package:flutter/cupertino.dart';
import 'package:usafes/forms/base_form.dart';
import 'package:usafes/interfaces/form_controller_interface.dart';

class LoginForm extends BaseForm implements FormControllerInterface {
  final email = TextEditingController();
  final password = TextEditingController();

  @override
  final List<String> errorKeys = ['email', 'password'];

  @override
  void dispose() {
    email.dispose();
    password.dispose();
  }

  @override
  Map<String, String> toObject() {
    return {
      'email': email.text.trim(),
      'password': password.text.trim(),
    };
  }
}
