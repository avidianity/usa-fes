import 'package:flutter/material.dart';
import 'package:usafes/exceptions/no_user.dart';
import 'package:usafes/models/user.dart';

class UserNotifier extends ChangeNotifier {
  UserModel? _user;

  UserModel get user => _user == null ? throw NoUserException() : _user!;

  UserNotifier set(UserModel user) {
    _user = user;

    notifyListeners();

    return this;
  }

  UserNotifier clear() {
    _user = null;

    notifyListeners();

    return this;
  }
}
