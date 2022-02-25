import 'package:flutter/material.dart';
import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/exceptions/http/internal_server_error.dart';
import 'package:usafes/exceptions/http/validation.dart';
import 'package:usafes/forms/register.dart';
import 'package:usafes/models/section.dart';
import 'package:usafes/services/auth.dart';
import 'package:usafes/services/section.dart';

import '../../components/shared/logo.dart';

class Register extends StatefulWidget {
  const Register({Key? key}) : super(key: key);

  @override
  RegisterState createState() => RegisterState();
}

class RegisterState extends State<Register> {
  final _formKey = GlobalKey<RegisterState>();
  final controller = RegisterForm();
  final authService = AuthService();
  final sectionService = SectionService();
  List<SectionModel> sections = [
    SectionModel(
      id: 0,
      name: '',
      title: '-- Select --',
      level: 0,
      section: '',
      createdAt: '',
      updatedAt: '',
    )
  ];

  _showSnackException({required HttpException exception, Color? color}) {
    final snack = SnackBar(
      content: Text(exception.message),
      backgroundColor: color,
      action: SnackBarAction(
        label: 'Dismiss',
        onPressed: () {
          ScaffoldMessenger.of(context).hideCurrentSnackBar();
        },
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snack);
  }

  submit() async {
    var data = controller.toObject();
    setState(() {
      controller.clearErrors();
    });

    try {
      final user = await authService.register(data);

      final snack = SnackBar(
        content: Text('Hi ${user.firstName}, thanks for registering!'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      );

      ScaffoldMessenger.of(context).showSnackBar(snack);

      Navigator.pushNamedAndRemoveUntil(context, '/', (_) => false);
    } on ValidationException catch (exception) {
      setState(() {
        controller.setErrors(exception.getErrors());
      });
    } on InternalServerErrorException catch (exception) {
      _showSnackException(exception: exception, color: Colors.red[400]);
    }
  }

  @override
  void initState() {
    super.initState();
    fetchSections();
  }

  Future<void> fetchSections() async {
    try {
      final response = await sectionService.get();
      setState(() {
        if (response.isNotEmpty) {
          sections = [
            SectionModel(
              id: 0,
              name: '',
              title: '-- Select --',
              level: 0,
              section: '',
              createdAt: '',
              updatedAt: '',
            ),
            ...response
          ];
        }
      });
    } on HttpException catch (exception) {
      _showSnackException(exception: exception, color: Colors.red[400]);
    }
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          await fetchSections();
        },
        child: Scaffold(
          body: Center(
            child: Form(
              key: _formKey,
              child: Padding(
                padding: const EdgeInsets.only(
                  left: 30,
                  right: 30,
                ),
                child: ListView(
                  shrinkWrap: true,
                  padding: const EdgeInsets.fromLTRB(8, 40, 8, 40),
                  children: <Widget>[
                    const Logo(),
                    const SizedBox(
                      height: 6,
                    ),
                    const Center(
                      child: Text(
                        'Register',
                        style: TextStyle(
                          fontSize: 30,
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 6,
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    TextField(
                      controller: controller.schoolId,
                      decoration: InputDecoration(
                        border: const UnderlineInputBorder(),
                        labelText: 'School ID',
                        errorText: controller.hasError('school_id')
                            ? controller.getError('school_id').join('\n')
                            : null,
                        icon: const Icon(
                          Icons.school_outlined,
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    DropdownButtonFormField<int>(
                      isExpanded: true,
                      decoration: InputDecoration(
                        border: const UnderlineInputBorder(),
                        icon: const Icon(Icons.class__outlined),
                        labelText: 'Section',
                        errorText: controller.hasError('section_id')
                            ? controller.getError('section_id').join('\n')
                            : null,
                      ),
                      style: const TextStyle(fontSize: 14, color: Colors.black),
                      value: controller.sectionId,
                      onChanged: (int? id) {
                        if (id != null) {
                          setState(() {
                            controller.sectionId = id;
                          });
                        }
                      },
                      items: sections
                          .map(
                            (section) => DropdownMenuItem<int>(
                              value: section.id,
                              child: Text(section.title),
                            ),
                          )
                          .toList(),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    TextField(
                      controller: controller.firstName,
                      decoration: InputDecoration(
                        border: const UnderlineInputBorder(),
                        labelText: 'First Name',
                        errorText: controller.hasError('first_name')
                            ? controller.getError('first_name').join('\n')
                            : null,
                        icon: const Icon(
                          Icons.badge_outlined,
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    TextField(
                      controller: controller.lastName,
                      decoration: InputDecoration(
                        border: const UnderlineInputBorder(),
                        labelText: 'Last Name',
                        errorText: controller.hasError('last_name')
                            ? controller.getError('last_name').join('\n')
                            : null,
                        icon: const Icon(
                          Icons.badge_outlined,
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    TextField(
                      controller: controller.email,
                      decoration: InputDecoration(
                        border: const UnderlineInputBorder(),
                        labelText: 'Email Address',
                        errorText: controller.hasError('email')
                            ? controller.getError('email').join('\n')
                            : null,
                        icon: const Icon(
                          Icons.email_outlined,
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    TextField(
                      controller: controller.password,
                      decoration: InputDecoration(
                        border: const UnderlineInputBorder(),
                        labelText: 'Password',
                        errorText: controller.hasError('password')
                            ? controller.getError('password').join('\n')
                            : null,
                        icon: const Icon(
                          Icons.lock,
                        ),
                      ),
                      obscureText: true,
                      enableSuggestions: false,
                      autocorrect: false,
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    TextField(
                      controller: controller.passwordConfirmation,
                      decoration: InputDecoration(
                        border: const UnderlineInputBorder(),
                        labelText: 'Confirm Password',
                        errorText: controller.hasError('password_confirmation')
                            ? controller
                                .getError('password_confirmation')
                                .join('\n')
                            : null,
                        icon: const Icon(
                          Icons.lock,
                        ),
                      ),
                      obscureText: true,
                      enableSuggestions: false,
                      autocorrect: false,
                    ),
                    const SizedBox(
                      height: 24,
                    ),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          submit();
                        },
                        child: const Text('Register'),
                      ),
                    ),
                    const SizedBox(
                      height: 4,
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/login');
                      },
                      child: const Text('Already have an account? Login'),
                    )
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
