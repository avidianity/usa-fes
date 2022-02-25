abstract class BaseModel {
  int id;
  String createdAt;
  String updatedAt;

  BaseModel({
    required this.id,
    required this.createdAt,
    required this.updatedAt,
  });

  dynamic toObject();

  String toJson();
}
