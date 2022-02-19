import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/components/shared/logo.dart';
import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/exceptions/no_token.dart';
import 'package:usafes/models/user.dart';
import 'package:usafes/services/auth.dart';

class Home extends StatelessWidget {
  Home({Key? key}) : super(key: key);

  final authService = AuthService();
  final storage = const FlutterSecureStorage();

  Future<UserModel> checkAuth() async {
    final user = await authService.check();

    await storage.write(key: 'user', value: user.toJson());

    return user;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UserModel>(
      future: checkAuth(),
      builder: (BuildContext context, AsyncSnapshot<UserModel> snapshot) {
        if (snapshot.hasData) {
          return SafeArea(
            child: Scaffold(
              body: Center(
                child: Padding(
                  padding: const EdgeInsets.only(top: 40.0),
                  child: Text('Hi ${snapshot.data!.firstName}!'),
                ),
              ),
            ),
          );
        } else if (snapshot.hasError) {
          var error = snapshot.error;
          if (error is NoTokenException) {
            return _buildNoLogin(context);
          } else if (error is HttpException) {
            storage.delete(key: 'user');
            storage.delete(key: 'token');
            return _buildNoLogin(context);
          }
        }

        return const SafeArea(
          child: Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          ),
        );
      },
    );
  }

  Widget _buildNoLogin(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.only(top: 40.0),
            child: Column(
              children: <Widget>[
                const Logo(),
                const SizedBox(height: 20),
                const Text(
                  'University of San Agustin',
                  style: TextStyle(fontSize: 26),
                ),
                const Text(
                  'Faculty Evaluation System',
                  style: TextStyle(fontSize: 20),
                ),
                const SizedBox(
                  height: 10,
                ),
                SizedBox(
                  width: double.infinity,
                  child: Padding(
                    padding: const EdgeInsets.only(
                      left: 20,
                      right: 20,
                    ),
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/login');
                      },
                      child: const Text('Login'),
                    ),
                  ),
                ),
                SizedBox(
                  width: double.infinity,
                  child: Padding(
                    padding: const EdgeInsets.only(
                      left: 20,
                      right: 20,
                    ),
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/register');
                      },
                      child: const Text('Register'),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
