import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/exceptions/no_token.dart';
import 'package:usafes/http/client.dart';
import 'package:usafes/models/user.dart';
import 'package:usafes/services/responses/login.dart';

class AuthService {
  final http = Client();
  final storage = const FlutterSecureStorage();
  final Map<String, String> headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  Future<LoginResponse> login(Map<String, String> data) async {
    data['role'] = 'Student';

    final response = await http.post(
      '/api/auth/login',
      data,
      headers: headers,
    );

    final String token = response.data['token'];
    final user = UserModel.fromJson(response.data['user']);

    return LoginResponse(user: user, token: token);
  }

  Future<UserModel> register(Map<String, dynamic> data) async {
    data['role'] = 'Student';

    final response = await http.post(
      '/api/auth/register',
      data,
      headers: headers,
    );

    return UserModel.fromJson(response.data);
  }

  Future<UserModel> check() async {
    final token = await storage.read(key: 'token');

    if (token == null) {
      throw NoTokenException();
    }

    final response = await http.get(
      '/api/auth/check',
      headers: {
        ...headers,
        'Authorization': 'Bearer $token',
      },
    );

    return UserModel.fromJson(response.data);
  }
}
