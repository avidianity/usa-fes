abstract class BaseForm {
  final Map<String, List<String>> errors = {};
  abstract final List<String> errorKeys;

  BaseForm() {
    clearErrors();
  }

  bool hasError(String key) {
    return errors.containsKey(key) && errors[key]!.isNotEmpty;
  }

  bool hasErrors() {
    for (final key in errorKeys) {
      if (errors.containsKey(key) && errors[key]!.isNotEmpty) {
        return true;
      }
    }

    return false;
  }

  void clearErrors() {
    for (final key in errorKeys) {
      errors[key] = [];
    }
  }

  setErrors(dynamic errors) {
    for (final key in errorKeys) {
      setError(key, errors[key]);
    }
  }

  setError(String key, List<dynamic>? errors) {
    this.errors[key] = errors != null ? errors.cast<String>() : [];
  }

  Map<String, List<String>> getErrors() {
    return errors;
  }

  List<String> getError(String key) {
    return errors[key] ?? [];
  }
}
