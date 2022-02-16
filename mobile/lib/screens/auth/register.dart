import 'package:flutter/material.dart';
import 'package:usafes/components/shared/logo.dart';
import 'package:usafes/forms/login.dart';

class Register extends StatefulWidget {
  const Register({Key? key}) : super(key: key);

  @override
  RegisterState createState() => RegisterState();
}

class RegisterState extends State<Register> {
  final _formKey = GlobalKey<RegisterState>();
  final controller = LoginForm();

  submit() {
    var data = controller.toObject();
    print(data);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.only(top: 40.0),
            child: Form(
              key: _formKey,
              child: Padding(
                padding: const EdgeInsets.only(
                  left: 30,
                  right: 30,
                ),
                child: Column(
                  children: <Widget>[
                    const Logo(),
                    const SizedBox(
                      height: 6,
                    ),
                    const Text(
                      'Register',
                      style: TextStyle(
                        fontSize: 30,
                      ),
                    ),
                    const SizedBox(
                      height: 6,
                    ),
                    TextField(
                      controller: controller.email,
                      decoration: const InputDecoration(
                        border: UnderlineInputBorder(),
                        labelText: 'Email Address',
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    TextField(
                      controller: controller.password,
                      decoration: const InputDecoration(
                        border: UnderlineInputBorder(),
                        labelText: 'Password',
                      ),
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
