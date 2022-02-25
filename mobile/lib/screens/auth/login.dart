import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/components/shared/logo.dart';
import 'package:usafes/exceptions/http/forbidden.dart';
import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/exceptions/http/internal_server_error.dart';
import 'package:usafes/exceptions/http/validation.dart';
import 'package:usafes/forms/login.dart';
import 'package:usafes/services/auth.dart';

class Login extends StatefulWidget {
  const Login({Key? key}) : super(key: key);

  @override
  LoginState createState() => LoginState();
}

class LoginState extends State<Login> {
  final _formKey = GlobalKey<LoginState>();
  final controller = LoginForm();
  final authService = AuthService();
  final storage = const FlutterSecureStorage();

  _showSnackException(
      {required HttpException exception, Color? color, Color? actionColor}) {
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

  submit() async {
    var data = controller.toObject();
    setState(() {
      controller.clearErrors();
    });

    try {
      final response = await authService.login(data);

      await storage.write(key: 'token', value: response.token);
      await storage.write(key: 'user', value: response.user.toJson());

      final snack = SnackBar(
        content: Text('Hi ${response.user.firstName}, welcome back!'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      );

      ScaffoldMessenger.of(context).showSnackBar(snack);

      Navigator.of(context).pop(response.user);
    } on ForbiddenException catch (exception) {
      _showSnackException(
        exception: exception,
        color: Colors.amber[700],
        actionColor: Colors.white,
      );
    } on ValidationException catch (exception) {
      setState(() {
        controller.setErrors(exception.getErrors());
      });
    } on InternalServerErrorException catch (exception) {
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
      child: Scaffold(
        body: Center(
          child: Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.only(
                left: 30,
                right: 30,
              ),
              child: SingleChildScrollView(
                child: Column(
                  children: <Widget>[
                    const Logo(),
                    const SizedBox(
                      height: 6,
                    ),
                    const Text(
                      'Login',
                      style: TextStyle(
                        fontSize: 30,
                      ),
                    ),
                    const SizedBox(
                      height: 6,
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
                      height: 24,
                    ),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          submit();
                        },
                        child: const Text('Login'),
                      ),
                    ),
                    const SizedBox(
                      height: 4,
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/register');
                      },
                      child: const Text('Don\'t have an account? Register'),
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
