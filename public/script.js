const PRICE = 10;
const LOAD_ITEM = 10;
new Vue({
    el:'#app',
    data:{
        total:0,
        items:[],
        results:[],
        cart:[],
        newSearch:'90s',
        lastSearch:'',
        price:PRICE,
        loading:false
    },
    computed: {
        noMoreItem:function () {
            return this.results.length === this.items.length && this.results.length > 0;
        }
    },
    methods:{
        appendItems: function () {
            if (this.items.length < this.results.length){
                var append = this.results.slice(this.items.length,this.items.length+LOAD_ITEM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function () {


            if (this.newSearch.length >0){
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function (response) {
                        this.loading = false;
                        this.lastSearch = this.newSearch;
                        this.results = response.data;
                        this.appendItems();
                    });
            }
        },
        addItem: function (index) {
            this.total+= PRICE;
            var found = false;
            var item = this.items[index];
            for (i=0; i<this.cart.length; i++){
                if (this.cart[i].id == item.id){
                    this.cart[i].qty++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    'id' : item.id,
                    'title' : item.title,
                    'qty' : 1,
                    'price': PRICE
                });
            }
        },
        inc: function (item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function (item) {
            item.qty--;
            this.total -= PRICE;
            if(item.qty <= 0){
                for (i=0; i<=this.cart.length;i++){
                    if (this.cart[i].id === item.id){
                        this.cart.splice(i,1);
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2))
        }
    },
    mounted:function () {
        this.onSubmit();
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        var vueInstance = this;
        watcher.enterViewport(function () {
            vueInstance.appendItems();
        });
    }
});

