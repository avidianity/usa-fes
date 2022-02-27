import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/exceptions/no_token.dart';
import 'package:usafes/http/client.dart';

class EvaluationService {
  final client = Client();
  final storage = const FlutterSecureStorage();

  Future<void> store(dynamic data) async {
    final token = await storage.read(key: 'token');

    if (token == null) {
      throw NoTokenException();
    }

    await client.post('/api/answers/many', data, headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
  }
}
