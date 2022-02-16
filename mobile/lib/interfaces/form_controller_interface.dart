abstract class FormControllerInterface {
  void dispose();

  Map<String, dynamic> toObject();

  setErrors(Map<String, List<String>> errors);

  setError(String key, List<String> errors);

  Map<String, List<String>> getErrors();

  List<String> getError(String key);

  bool hasError(String key);

  bool hasErrors();

  void clearErrors();
}
