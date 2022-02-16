class Response<T> {
  final int code;
  final T data;
  final Map<String, String> headers;

  Response({required this.code, required this.data, required this.headers});
}
