import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:usafes/screens/auth/login.dart';
import 'package:usafes/screens/auth/register.dart';
import 'package:usafes/screens/home.dart';
import 'package:usafes/screens/loading_screen.dart';

Future main() async {
  await dotenv.load();
  runApp(const App());
}

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'USA-FES',
      initialRoute: '/loading',
      routes: {
        '/': (context) => const Home(),
        '/loading': (context) => const LoadingScreen(),
        '/login': (context) => const Login(),
        '/register': (context) => const Register(),
      },
      theme: ThemeData(fontFamily: 'Lato'),
    );
  }
}
