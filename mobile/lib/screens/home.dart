import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/components/dashboard.dart';
import 'package:usafes/components/shared/logo.dart';
import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/exceptions/no_token.dart';
import 'package:usafes/models/user.dart';
import 'package:usafes/services/auth.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  HomeState createState() => HomeState();
}

class HomeState extends State<Home> {
  final authService = AuthService();
  final storage = const FlutterSecureStorage();
  UserModel? user;

  @override
  void initState() {
    super.initState();
  }

  Future<UserModel> checkAuth() async {
    final user = await authService.check();

    await storage.write(key: 'user', value: user.toJson());

    return user;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UserModel>(
      future: user == null ? authService.check() : Future.value(user),
      builder: (BuildContext context, AsyncSnapshot<UserModel> snapshot) {
        if (snapshot.hasData) {
          return const Dashboard();
        } else if (snapshot.hasError) {
          var error = snapshot.error!;
          if (error is NoTokenException) {
            return _buildNoLogin(context);
          } else if (error is HttpException) {
            storage.delete(key: 'user');
            storage.delete(key: 'token');
            return _buildNoLogin(context);
          } else {
            throw error;
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
                    child: ElevatedButton.icon(
                      icon: const Center(
                        child: Icon(Icons.login),
                      ),
                      onPressed: () async {
                        final user =
                            await Navigator.pushNamed(context, '/login');

                        if (user is UserModel) {
                          setState(() {
                            this.user = user;
                          });
                        }
                      },
                      label: const Padding(
                        padding: EdgeInsets.only(left: 10),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Text('Login'),
                        ),
                      ),
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
                    child: ElevatedButton.icon(
                      icon: const Center(
                        child: Icon(Icons.app_registration),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, '/register');
                      },
                      label: const Padding(
                        padding: EdgeInsets.only(left: 10),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Text('Register'),
                        ),
                      ),
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
