# Go utils

Golang utils.

## Break line

Break line breaks the function arguments into multiple lines.

### Examples

```go
func (p *receiver) funcName(arg1 func (a1 t1, a2 t2) (tres), arg2 type2, arg3 type3) (func (a1 t1, a2 t2) (tres), error) {
	body
}
```
```go
func (p *receiver) funcName(
	arg1 func (a1 t1, a2 t2) (tres),
	arg2 type2,
	arg3 type3,
) (
	func (a1 t1, a2 t2) (tres),
	error,
) {
	body
}
```
