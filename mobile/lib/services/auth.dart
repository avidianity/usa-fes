import 'package:usafes/http/client.dart';

class AuthService {
  final http = Client();
  final Map<String, String> headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  login(Map<String, String> data) async {
    data['role'] = 'Student';

    final response = await http.post(
      '/api/auth/login',
      data,
      headers: headers,
    );

    return response.data;
  }
}
