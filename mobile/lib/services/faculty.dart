import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/exceptions/no_token.dart';
import 'package:usafes/http/client.dart';
import 'package:usafes/models/user.dart';

class FacultyService {
  final client = Client();
  final storage = const FlutterSecureStorage();
  final Map<String, String> headers = {
    'Accept': 'application/json',
  };

  Future<List<UserModel>> fetch() async {
    final token = await storage.read(key: 'token');

    if (token == null) {
      throw NoTokenException();
    }

    final response = await client.get(
      '/api/users/faculties',
      headers: {
        ...headers,
        'Authorization': 'Bearer $token',
      },
    );

    return UserModel.collection(response.data);
  }
}
