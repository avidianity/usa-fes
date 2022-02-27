import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/exceptions/no_token.dart';
import 'package:usafes/http/client.dart';
import 'package:usafes/models/criteria.dart';

class CriteriaService {
  final storage = const FlutterSecureStorage();
  final client = Client();

  Future<List<CriteriaModel>> fetch() async {
    final token = await storage.read(key: 'token');

    if (token == null) {
      throw NoTokenException();
    }

    final response = await client.get('/api/criterias', headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    });

    return CriteriaModel.collection(response.data);
  }
}
