var vm = new Vue({
    el: "#app",
    mounted: function() {
        this.$nextTick(function() {
            this.getBooks()
        })
    },
    data: {
        message: "Hello , Vue.js",
        selected: "B",
        book: {
            id: 0,
            author: "",
            name: "",
            price: ""
        },
        // { id: 1, author: '曹雪芹', name: '红楼梦', price: 32.0 }, { id: 2, author: '施耐庵', name: '水浒传', price: 30.0 }, { id: '3', author: '罗贯中', name: '三国演义', price: 24.0 }, { id: 4, author: '吴承恩', name: '西游记', price: 20.0 }
        books: [],
        sortparam: ""
    },
    methods: {
        getBooks: function() {
            this.$http.get("books.json")
                .then((response) => {
                    console.log(response.data);
                    this.books = response.data;
                }).catch(function(response) {

                })
        },
        addbook: function() {
            this.book.id = this.books.length + 1
            this.books.push(this.book)
            this.book = ""
        },
        delbook: function(book) {
            var index = this.books.indexOf(book)
            this.books.splice(index, 1)
        },
        sortby: function(sortparam) {
            this.books = _.sortBy(this.books, sortparam, ['asc', 'desc'])
        }
    },
    computed: {
        sum: function() {
            var result = 0;
            for (var i = 0; i < this.books.length; i++) {
                result += Number(this.books[i].price);
            };
            return result;
        }
    }
})