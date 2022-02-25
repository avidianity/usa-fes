import 'dart:convert';

import 'package:usafes/models/base.dart';

class FileModel extends BaseModel {
  String type;
  String name;
  String url;
  int size;

  FileModel({
    required int id,
    required this.name,
    required this.type,
    required this.url,
    required this.size,
    required String createdAt,
    required String updatedAt,
  }) : super(
          id: id,
          createdAt: createdAt,
          updatedAt: updatedAt,
        );

  factory FileModel.fromJson(dynamic data) {
    var instance = FileModel(
      id: data['id'],
      name: data['name'],
      type: data['type'],
      url: data['url'],
      size: data['size'],
      createdAt: data['created_at'],
      updatedAt: data['updated_at'],
    );

    return instance;
  }

  static List<FileModel> collection(List<dynamic> collection) {
    List<FileModel> data = [];

    for (var entry in collection) {
      data.add(FileModel.fromJson(entry));
    }

    return data;
  }

  @override
  toObject() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'url': url,
      'size': size,
      'created_at': createdAt,
      'updated_at': updatedAt
    };
  }

  @override
  String toJson() {
    return jsonEncode(toObject());
  }
}
