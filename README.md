
# GHI CHÚ VỀ KHÓA HỌC GRAPHQL APOLLO 2022

# Nội dung

- [Schema](#schema)
- [Query](#query)
- [Mutation](#mutation)
- [Resolver](#resolver)
- [Aguments](#aguments)
- [Others](#others)

---

## Schema

- `Khái niệm`: Schema là một tập hợp các object type có chứa các field. Mỗi field có một type của riêng nó. Type của field có thể là kiểu dữ liệu scalar hoặc có thể là object type khác. Schema trong graphGL được viết theo SDL
- `Ví dụ`: `type Character { name: String! appearsIn: [Episode!]! }`
- `Types của Schema`:
  - **Scalar**: Có thể là Int, Float, String, Boolean, ID
  - **Object**: Một field của type có thể là một object type
  - **Query**: Là object type đặc biệt để cho client có thể query các field được định nghĩa bên trong, dùng để read data
  - **Muatation**: Gần giống với Query type nhưng để ghi data
  - **Input**: Là một object type đặc biệt, giúp nhóm một tập hợp các field như là arguments , và có thể sử dụng như là một argument ở các field
  - **Enum**: Giống như Scalar, nhưng các giá trị của filed có kiểu enum phải được định nghĩa trong enum
  - **Interface**: Là một kiểu trừu tượng để định nghĩa một tập các field, mà object type khác có thể kế thừa các field trong đó
  - **Union**:

---

## Query

- Khác với restAPI có nhiều entry point, grapql có một entry point duy nhất để thực hiện lấy data, client chỉ cần gửi một câu query đến server để lấy các trường data theo ý mình theo một cấu trúc nhất định. Trước đó ở server, schema cần định nghĩa một Query type và các field có thể truy vấn được

- Cấu trúc của một câu query từ client:

```
        Query NameQuery{
            field1
            field2 {
                field2_1
                field2_2
                ...
            }
            ...
        }
```

---

## Mutation

- Mutation gần giống với Query ngoài việc Query để reading data còn Mutation để writing data

---

## Aguments

- Là tập các tham số được được cung cấp cho 1 filed trong 1 câu query, và Schema phải định nghĩ arguments cho mỗi filed được truyền đối số vào.
- Resolver sử dụng arguments được cung cấp của một field để chuyển đổi dữ liệu cho filed đó. Arguments giúp ta truy xuất các đối tượng cụ thể, lọc qua một tập hợp các đối tượng.
- Cách sử dụng:

```
Định nghĩa trong schema: type query {
                            filed1(arg1:type,...)
                            filed2(arg1:type,...)
                            ...
                        }
Sử dụng khi query:  {
            filed1(arg1:"ID",arg2:"ID")
            filed2(arg1:"ID",arg2:"ID")
            }
```

---

## Resolver

- `Khái niệm`: Resolver làm nhiệm vụ gắn data cho mỗi filed của mỗi Type trong Schema. Resolver bản chất là một funtion, và có cùng tên với field mà nó populate đến. Nó có thể fecth Data từ bất kỳ data source nào và chuyển dổi data cho phù hợp theo yêu cầu của client

- `Arguments của Resolver`: fieldName(parents, args, context, info) { result }

  **parents**: là một object chứa kết quả của lời gọi hàm resolver ở node cha

  **args**: là các aguments được truyền vào các field trong query

  **context**: là một object được truyền xuyên suốt trong các resolver, mỗi resolver có thể ghi và đọc thông tin trong context. Nó được dùng dể lưu trữ auth, người dụng hiện tại, kết nối database,...

  **info**: chứa thông tin về AST của câu query hay muatation

## Others

`Context được tạo ra khi nào?`

- Context được tạo ra khi client gửi mỗi câu request lên server

`Flow của funtion khi client gửi request query:`

1. Server sẽ thực thi hàm context để gán data cho tham số context resolver
2. Server phân tích tính đúng đắn trong câu query và đưa vào cây AST được gửi
3. Nếu câu query sai cấu trúc, thì server gửi báo lỗi
4. Nếu đúng, gọi từng hàm resolver cho từng field trong câu query theo thuật toán BFS, nếu field đó là scalar gọi resolver và dừng, nếu là một object thì gọi resolver cho chính field đó để lấy data và tiếp tục gọi các resolver cho các filed con của nó và truyền vào tham số parent cho mỗi resolver là data trước đó.

`So sánh Input và Type:`

- **Input**: định nghĩa một tập hợp các field như là arguments và chỉ dùng để truyền vào như là arguments của một filed khác, không dùng để định nghĩa type cho một field
- **Type**: định nghĩa một Object type chứa các filed và không thể truyền như là một tham số cho một filed

`Interface và Union`

- Cả Interface và Union đều là kiểu dữ liệu trừu tượng cho phép 1 field trong chema có thể trả về 1 của nhiều kiểu object type

  **Interface:**

- Là một kiểu dữ liệu trừa tượng cho phép khai báo một tập các field, mà các object type khác có thể kế thừa, khi một một object type kế thừa một interface thì bắt buộc object type đó phải khai báo tất cả các field ứng với type đã được khai báo trong interface, ngoài ra có thể thêm vào các field khác
- Interface cũng có thể sử dụng để định nghĩa field type
- Ví dụ:

  **Union:**

- Union là type dùng để khai báo nhiều object type khác nhau trong cùng một field để trả về nhiều object type khác nhau
- Có thể sử dụng từ khóa \_\_typename trong câu query để xem tên của Object type
- Và để resolving một union type cần đặt têm hàm là \_\_resolveType và tiến hành xử lý bên trong

`Query fragments`

- fragment trong GraphQl là một tập con các field trong một object type đã khai báo mà qua đó có thể sử dụng lại vào chia sẻ trong hệ thống Graph

`Cách mà GraphQL authentication`

- Phía client: Gửi req lên server có đính kèm thông tin xác thực vào HTTP req
- Phía Server:
  - Nhận và xử lý thông tin xác thực được gửi từ client
  - Nếu thông tin xác thực đúng thì nó sẽ sử dụng service để login
  - Nếu login thành công, service xác thực sẽ trả về thông tin của người dùng login như id, role
  - Server sẽ thêm các thông tin của người dùng đó vào context object để có thể sử dụng cho tất cả resolve

`Cách mà GraphQL Authorization trong Airlock app - sử dụng field-level authorization`

- Để có thể tiến hành phân quyền cần sử dụng context object để xác thực người dùng cho từng cấp độ resolver.
- Ở mỗi resolve kiểm tra quyền truy cập, hoặc đã login hay chưa,...
=======
# GraphQL
## Mục lục
  1. [Schema](#schema)
  2. [Arguments](#arguments)
  3. [Types](#types)
  4. [Resolvers](#resolvers)
  5. [Flow](#flow)
## Schema
* Schema là tập hợp các kiểu object trong đó mỗi object chứa các field mang kiểu dữ liệu schalar hoặc kiểu object khác. Schema là một lớp trừu tượng giúp cho frontend và backend biết cần yêu cầu cũng như kéo về dữ liệu như thế nào.
## Arguments
* Argument là giá trị bạn cung cấp cho từng field trong query. Nó dùng để xác định làm thế nào để populate data cho field đó.
* Các resolvers có thể dùng arguments để kéo về những object riêng biệt, lọc data từ 1 set các object hay thậm chí là biến đổi giá trị trả về của field.
## Types
* **Schalar types:** Int, Float, String, Boolean, ID
* **Object types:**  một object sẽ bao gồm nhiều field, mỗi field sẽ có kiểu dữ liệu riêng
* **Query type:** là một kiểu object đặc biệt định nghĩa entry points cho các read operations
* **Mutation type:** là một kiểu object đặc biệt định nghĩa entry points cho các write operations
* **Input object types:**
  * Mỗi field của 1 input object type chỉ có thể là scalar, enum, hoặc input object type khác
  * Giống kiểu object nhưng có thể dùng nó như các arguments của các field trong các kiểu object thông thường khác
* **Enum types:** kiểu enum dùng để biểu diễn 1 list các giá trị có thể định nghĩa cho field đó.
  * Mặc dù có thể sủ dụng kiểu String để biểu diễn cho locationType ("spaceship" hoặc "house"...) nhưng nếu người dùng nhập cái gì đó không hợp lệ ("space ship", "bla bla"...) thì sẽ gây ra những unnecessary complications (ví dụ như thiếu dữ liệu, dữ liệu sai...) khi mình filter hay tổ chức dữ liệu
  * Để giữ cho data clean và consistent, ta nên sử dụng enum giới hạn locationType về 1 set các giá trị nhỏ hơn
* **Union type:** định nghĩa những object types nào sẽ nằm trong union
  * Ví dụ:
  
    ---

        union Media = Book | Movie

    ---
  * Tất cả kiểu dữ liệu trong union phải là object type
* **Interface:** xác định các field cho nhiều object types
  * Nếu 1 object type implements interface thì nó phải bao gồm tất cả các field mà interface có
  * 1 field có thể có kiểu dữ liệu là 1 interface. Nó có thể trả về bất cứ object type nào mà implements interface đó
### Có 2 nhóm types:
* **Input types:** Schalar, Enum, Input object types
* **Output types:** Scalar, Object, Interface, Union, Enum
## Resolvers
**Resolver** là một function chịu trách nghiệm populate data cho 1 field trong schema
* Nếu resolver không được định nghĩa thì Apollo Server sẽ tự định nghĩa **[default resolver](https://www.apollographql.com/docs/apollo-server/data/resolvers#default-resolvers)**
* **Resolving object, query or mutation:**

  ---
      Query: {
        field_name(parent, args, context, info) {  
          //return something;  
        }
      }

  ---
  * **parent:** giá trị trả về của resolver của field cha của nó
    
    ---

        query GetBooksByLibrary {  
          libraries {  
            books {  
              title  
              author {  
                name  
              }  
            }  
          }  
        }  

    ---
    Ví dụ: parent của author là books
  * **args:** object chứa tất các arguments của field này
  * **context:** được tạo ra khi client gửi 1 request đến server, dùng để truyền những thứ cho resolver cần như là authentication scope, database connections, custom fetch functions.
  * **info:** chứa thông tin trạng thái thực thi của operations (query, mutation) dưới dạng AST
* **Resolving a union or an interface:**

  ---

      Book: {
        __resolveType(obj, context, info){
          // Only Author has a name field
          if(obj.name){
            return 'Author';
          }
          // Only Book has a title field
          if(obj.title){
            return 'Book';
          }
          return null; // GraphQLError is thrown
        },
      }

  ---
# Flow
1. Client gửi request cho server
2. Gọi hàm khởi tạo context
3. Parse query thành AST
4. Kiểm tra AST có field nào không định nghĩa trong schema không. Nếu có thì báo lỗi, ngược lại gọi các hàm resolvers
5. Các resolver được gọi theo resolver chain:
  * Resolve các query chỉ có scalar, enum hay list các kiểu dữ liệu đó thì chỉ cần 1 resolver
  * Khi resolve object type: nó sẽ resolve các schalar, enum field trước, đến field là object type thì nó truyền tham số parent cho resolver tiếp theo và tiếp tục resolve cho đến khi hết field.
  
    >Lưu ý: resolver cha chỉ gọi resolver con khi query yêu cầu field con đó.
>>>>>>> 0158622f6ce15ba901392299863160b16886d19d
