import 'package:usafes/http/client.dart';
import 'package:usafes/models/section.dart';

class SectionService {
  final http = Client();

  Future<List<SectionModel>> get() async {
    final response = await http.get(
      '/api/sections',
      headers: {
        'Accept': 'application/json',
      },
    );

    return SectionModel.collection(response.data);
  }
}
