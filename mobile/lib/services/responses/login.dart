import 'package:usafes/models/user.dart';

class LoginResponse {
  UserModel user;
  String token;

  LoginResponse({
    required this.user,
    required this.token,
  });
}
