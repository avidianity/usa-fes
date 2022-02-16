abstract class BaseForm {
  final Map<String, List<String>> errors = {};
  abstract final List<String> keys;

  BaseForm() {
    clearErrors();
  }

  bool hasError(String key) {
    return errors[key]!.isNotEmpty;
  }

  bool hasErrors() {
    for (final key in keys) {
      if (errors[key]!.isNotEmpty) {
        return true;
      }
    }

    return false;
  }

  void clearErrors() {
    for (final key in keys) {
      errors[key] = [];
    }
  }

  setErrors(dynamic errors) {
    setError('email', errors['email']);
    setError('password', errors['password']);
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
