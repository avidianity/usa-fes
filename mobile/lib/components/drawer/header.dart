import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:usafes/models/file.dart';
import 'package:usafes/models/user.dart';

class Header extends StatelessWidget {
  const Header({Key? key, required this.user}) : super(key: key);

  final UserModel user;

  String _buildPicture(FileModel file) {
    Uri serverUri = Uri.parse(dotenv.env['SERVER_URL']!);
    Uri fileUri = Uri.parse(file.url);

    return Uri(
      scheme: serverUri.scheme,
      host: serverUri.host,
      port: serverUri.port,
      path: fileUri.path,
    ).toString();
  }

  @override
  Widget build(BuildContext context) {
    return DrawerHeader(
      decoration: const BoxDecoration(
        color: Colors.blue,
      ),
      child: Stack(
        children: <Widget>[
          Align(
            alignment: Alignment.centerLeft,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(1500.0),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.3),
                    spreadRadius: 1,
                    blurRadius: 15,
                  ),
                ],
              ),
              child: CircleAvatar(
                radius: 40,
                backgroundColor: Colors.blue[100],
                child: CircleAvatar(
                  backgroundColor: Colors.white,
                  radius: 38,
                  backgroundImage: user.picture != null
                      ? NetworkImage(
                          _buildPicture(user.picture!),
                        )
                      : null,
                  child: user.picture == null
                      ? Image.asset(
                          'assets/user.png',
                          width: 73.0,
                          height: 73.0,
                        )
                      : null,
                ),
              ),
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              user.firstName,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
              ),
            ),
          ),
          Align(
            alignment: Alignment.centerRight + const Alignment(0, .3),
            child: Text(
              user.email,
              style: const TextStyle(
                color: Colors.white70,
              ),
            ),
          )
        ],
      ),
    );
  }
}
