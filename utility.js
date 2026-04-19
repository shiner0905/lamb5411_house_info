
Vue.use(window.vuelidate.default)
const {
    required, email, minLength, helpers
} = window.validators;
const telValidator = helpers.regex("tel", /^(09\d{8}|0\d{9})$/);
;

Vue.filter('formatCurrency', function (value) {
    return parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").replace(".00", "");
});

//var rootUrl = window.location.origin + "/pageone-1";
//var rootUrl = window.location.origin + "/pageone-2";
//var rootUrl = window.location.origin + "/pageone-3";
//var rootUrl = window.location.origin + "/ezweb-new";
//var rootUrl = window.location.origin;


var webOrderName = $("#ctl00_initValue_HiddenField1").val() + "_order_cart_products";

var nationStr = $(".nation-val").val();
var memberNum = 0;

var kindUrlStr = "";
var isOnePage = false;
//if (typeof (getUrlVars()["kind"]) !== "undefined" && getUrlVars()["kind"] !== "") {
//    kindUrlStr = getUrlVars()["kind"].replace("#", "");
//}
if (typeof (urlQueryString) !== "undefined" && urlQueryString !== "") {
    //kindUrlStr = urlQueryString["kind"].replace("#", "");
    kindUrlStr = urlQueryString["kind"];
}

var onePageWebOrderName = $("#ctl00_initValue_HiddenField1").val() + "_onepage_" + kindUrlStr + "_order_cart_products";
var onePageTempWebOrderName = $("#ctl00_initValue_HiddenField1").val() + "_onepage_preview_" + kindUrlStr + "_order_cart_products";

var currPageWebOrderName = "";

if (typeof (onepageWeb) !== "undefined" && onepageWeb !== "") {
    if (onepageWeb["isOne"] == "Y") {
        isOnePage = true;
        currPageWebOrderName = onePageWebOrderName;
        if (typeof (onepagePreviewWeb) !== "undefined" && onepagePreviewWeb !== "") {
            if (onepagePreviewWeb["isOne"] == "Y") {
                currPageWebOrderName = onePageTempWebOrderName;
            }
        }
    }
} else {
    currPageWebOrderName = webOrderName;
}



//if (window.location.href.indexOf("_onepage") > -1) {
//    currPageWebOrderName = onePageWebOrderName;
//    if (window.location.href.indexOf("_preview") > -1) {
//        currPageWebOrderName = onePageTempWebOrderName;
//    }
//}else {
//    currPageWebOrderName = webOrderName;
//}


//一頁式，移除正常網頁的
//if (window.location.origin.indexOf("_onepage") > -1) {
//    localStorage.removeItem(webOrderName);
//    webOrderName = $("#ctl00_HiddenField1").val() + "_onepage_order_cart_products";
//} else {
//    localStorage.removeItem($("#ctl00_HiddenField1").val() + "_onepage_order_cart_products");
//}



var dataText = '';
var data2Text = '';

var dataValue = '';
var data2Value = '';

//localStorage
var expiredTime = 28800000; //8小時
var exist = [];
var tmp = [];
var stp = 1; //結帳步驟

//productFilter
var listsort = "range";


//if (localStorage.getItem("order_cart_products") === null) {
if (getWithExpiry(currPageWebOrderName) === null) {

} else {
    //tmp.push(JSON.parse(localStorage.getItem("order_cart_products")));
    //tmp = JSON.parse(localStorage.getItem("order_cart_products"));

    //if()
    tmp = JSON.parse(getWithExpiry(currPageWebOrderName));
    //tmp.push(JSON.parse(getWithExpiry("order_cart_products")));
    //console.log(tmp.length);
    if (typeof (tmp.length) == "undefined") {
        tmp = [];
        tmp.push(JSON.parse(getWithExpiry(currPageWebOrderName)));
    }
}

//購物車
Vue.component('shopping-cart', {
    props: ['items'],

    computed: {
        Total() {
            let total = 0;
            //var newAry = JSON.parse(this.items

            if (this.items.length > 0 || this.items !== null) {
                this.items.forEach(item => {
                    total += (item.price * item.qty);
                });
            }

            return total;
        }
    },

    methods: {
        // Remove item by its index
        removeItem(index) {
            //this.items.splice(index, 1);
            tmp.splice(index, 1);

            //if (localStorage.getItem("order_cart_products") === null) {
            if (getWithExpiry(currPageWebOrderName) === null) {
                tmp = [];
            } else {
                //更新localStorage
                if (tmp.length > 0) {
                    setWithExpiry(currPageWebOrderName, JSON.stringify(tmp), expiredTime);
                } else {
                    localStorage.removeItem(currPageWebOrderName);
                }

            }

        }
    }
})


Vue.component('v-style', {
    render: function (createElement) {
        return createElement('style', this.$slots.default)
    }
});

Vue.component('v-script', {
    render: function (createElement) {
        return createElement('script', this.$slots.default)
    }
});



let filter_info = {
    filterdata: {},
    countOfPage: 8,
    currPage: 1,
    filter_name: ''
}

let modelInfo = {
    id: '',
    name: '',
    spec_total: 0,
    spec1: '',
    spec2: '',
    spec1_txt: '',
    spec2_txt: '',
    spec_atext: '',
    spec_aValue: '',
    spec_sub_temp1: [],
    spec_sub_temp2: [],
    spec1_title: '',
    spec2_title: '',
    qty: 1,
    price: '',
    image: '',
    pro_num: '',
    total: '',
    tempProStatus: '',
    chkIfspecVal: true
}
let cartFormData = {
    memo: "",
    pay_method: [],
    delivery_method: [],
    payMsg: "",
    payInfoMsg: "",
    isAtm: false,
    atmBankCode: "",
    proPrice: 0,
    totalPrice:0,
    address: {
        city: [],
        area: [],
        post_number: '',
        selected:'',
        selected_item: '',
        address_txt:''
    },
    addressZip: '',
    //紅利
    useBonus:'',
    bonusData:[],
    freightData: [],
    freightRules:[]
}
let formData= {
    name: '',
    sex1: '男',
    phone: '',
    name2: '',
    sex2: '男',
    phone2: '',
    email: '',
    pay_method: null,
    delivery_method: null,
    get_time: '',
    get_holiday: '',
    c_num: '',
    c_title: '',
    demo: '',
    chkSameAddr:false
}

let finalInfo = {
    //orderdetail: null,
    orderdetail: {
        order_no: '',
        reg_time: '',
        name1: '',
        sex1: '',
        name2: '',
        sex2: '',
        email:'',
        postnumber: '',
        city_text: '',
        area_text: '',
        address: '',
        total_price: 0,
        pro_price: 0,
        pay_kind: ''
    },
    productdetail: null,
    feedetail: null,
    paydetail: [],
    tadeStatus:''
}


let memberInfo = {
    u_id: '',
    u_password: '',
    u_password_cer: '',
    u_name: '',
    u_sex: '',
    u_email: '',
    u_birthday: '',
    u_address: '',
}

let infiniteEeffect = {
    kind:0
}

let talkInfo = {
    talklist: [],
    words_txt: '',
    talk_num: 0,
    reply_words_txt:''
}
let AtmbankInfo = {
    bank_code: '',
    bank_date: '',
    isshow:false,
}

let faqaskInfo = {
    kind: 0,
    quest: "",
    u_name: "",
    email: "",
    mem_num: 0
}

let favoriteInfo = {
    favlist: [],
    favprospec2: [],
    proRows:""
}

let discountInfo = {
    discountlist:[]
}

let bonusInfo = {
    bonuslist: [],
    bonus_limit: "",
    bonus_total: "",
    bonus_used: "",
    bonus_active: false,
    bonus_isused: false
}

let couponInfo = {
    couponlist: [],
    coupon_input: "",
    coupon_active: false,
    coupon_category: "",
    coupon_isused: false,
    coupon_used: "",
    couponUsedlist: [],
    coupon_tabs_cot:"N"
}

let contactInfo = {
    contactList: [],
    contact_formNum: "",
    contact_title: "",
    contact_description: "",
    contact_city: [],
    contact_area: [],
    contact_address: "",
    contact_post_number: "",
    contact_selected:"",
    contact_selected_item: "",
    contact_address_txt: "",
}

let newaddress = {
    newaddress_city: [],
    newaddress_area: [],
    newaddress_address: "",
    newaddress_post_number: "",
    newaddress_address_txt: "",
}

let product_compare_info = {
    product_list: [],
    product_compare_view:false
}


//var productList = productsData.items;
const productVue = new Vue({
    el: '#pVue',
    data: {
        modelInfo,
        checkout1: true,
        checkout2: false,
        cartdetlist: [],
        cartItems: tmp, //購物車
        //cartItems: [], //購物車
        //items: productsData2,
        //items: tmp,
        prevNum: 0,
        items: [],
        shopping_items: [],
        submitted: false,
        //productShowDetail
        cartFormData,
        formData,
        //submitted: false,
        finalInfo,
        showAspPage: true,
        memberInfo,

        checkcode: '',

        // favorite
        favoriteInfo,

        //infinite
        infiniteEeffect,

        // talk
        talkInfo,
        //orderpayback
        AtmbankInfo,
        //faq
        faqaskInfo,
        // discount
        discountInfo,
        // bonus
        bonusInfo,
        // coupon
        couponInfo,
        filter_name: '',
        countOfPage: 8,
        currPage: 1,
        //filter_info
        filter_info,
        prolayout1: true,
        contactInfo,
        newaddress,
        //compare
        product_compare_info,

        //uc check
        doneStep1: false,
        doneStep2: false,
        doneStep3: false,
        hasErrors: false,

    },
    mounted: function () {

        

        var self = this;

       


        if (typeof ($(".mem_num-val")) != "undefined" && $(".mem_num-val").length > 0) {
            memberNum = $(".mem_num-val").val();
        }

        //首頁版型(聯絡我們)
        if ($("body.home .home-contact-area").length > 0) {

            var hoconarry = [], newcontarry = [];
            
            $(".homeContactNum-val").each(function (index, item) {
                hoconarry.push($(item).val());
            });

            
            let promises = [];
            for (i = 0; i < hoconarry.length; i++) {
                promises.push(
                    
                    axios
                        .get(rootUrl + 'api/ContactList/A03.contact-' + hoconarry[i] + "-" + nationStr)
                        .then((response) => {
                            if (response.data !== "") {
                                newcontarry.push(response.data);
                            }
                        })

                )
            }

            Promise.all(promises).then(() => {

                for (var i = 0; i < newcontarry.length; i++) {
                    for (var j = 0; j < hoconarry.length; j++) {
                        if (newcontarry[i].sectionNum === hoconarry[j]) {
                            this.contactInfo.contactList = newcontarry[i].list;
                            this.contactInfo.contact_title = newcontarry[i].rootInfo.main_title;
                            this.contactInfo.contact_description = newcontarry[i].rootInfo.main_description;
                            this.contactInfo.contact_city = newcontarry[i].addressRow;
                            this.contactInfo.contact_formNum = newcontarry[i].rootInfo.form_num;
                        }
                    }
                }

            });

        }

        //產品比較
        if ($("body.product.compare").length > 0) {

            var newArry = [];
            var webstorageName = $("#ctl00_HiddenField1").val() + "_compare_products";

           
            if (getWithExpiry(webstorageName) === null) {

            } else {
                newArry = JSON.parse(getWithExpiry(webstorageName));

                if (typeof (newArry.length) == "undefined") {
                    newArry = [];
                    newArry.push(JSON.parse(getWithExpiry(webstorageName)));
                }
            }

            if (newArry === null) {

            } else {

                var pro_com_pass = {
                    proDetail: newArry
                }

                var promises = [];
                promises.push(

                    axios
                        .post(rootUrl + 'api/productCompare', pro_com_pass)
                        .then((response) => {

                            if (response.data !== "") {
                                this.product_compare_info.product_list = response.data.list;
                                this.product_compare_info.product_compare_view = true;
                            } else {
                                this.product_compare_info.product_compare_view = false;
                            }

                        })
                );
                

                Promise.all(promises).then(() => {

                    //最愛
                    this.getFavPro();

                });


            }
        }

        //最新消息
        if ($("body.news.vue_filter").length > 0) {
            var urlKind = "0";
            if (urlQueryString["kind"] !== "" && urlQueryString["kind"] !== null && typeof urlQueryString["kind"] !== "undefined") {
                urlKind = urlQueryString["kind"];
            }

            axios
                .get(rootUrl + 'api/NewsFilter/' + urlKind + "-" + nationStr)
                .then((response) => {
                    this.filter_info.filterdata = response.data;
                })
        }

        //產品列表
        if ($("body.product.vue_filter").length > 0) {
            var urlKind = "0";
            if (urlQueryString["kind"] != "" && urlQueryString["kind"] != null && typeof urlQueryString["kind"] != "undefined") {
                urlKind = urlQueryString["kind"];
            }


            if (getUrlVars()["range"] != "" && getUrlVars()["range"] != null && typeof getUrlVars()["range"] != "undefined") {
                listsort = getUrlVars()["range"];
            }

            axios
                .get(rootUrl + 'api/ProductKindFilter/' + urlKind + "-" + nationStr + "-" + listsort)
                .then((response) => {
                    this.prodata = response.data;
                    
                })
        }


        //產品
        if ($("body.product").hasClass("show")) {
            axios
                .get(rootUrl + 'api/ProductFilter/' + urlQueryString["num"])
                .then((response) => {
                    
                    this.items = response.data.productdetails;
                 //  console.log(this.items);

                    var specTit = this.items[0].specTitle.split(',');

                    this.modelInfo.id = this.items[0].num;
                    this.modelInfo.name = this.items[0].name;
                    this.modelInfo.price = this.items[0].price;

                    this.modelInfo.spec1 = this.items[0].spec;

                    this.modelInfo.spec_total = this.items[0].specTotal;
                    this.modelInfo.image =  this.items[0].image;


                    //有規格
                    //有規格
                    if (this.modelInfo.spec_total > 0) {
                        if (this.items[0].spec.length > 0) {
                            for (var i = 0; i < this.items[0].spec.length; i++) {
                                var _tmp1 = {
                                    root: 0,
                                    text: this.items[0].spec[i].text,
                                    value: this.items[0].spec[i].value,
                                }
                                this.modelInfo.spec_sub_temp1.push(_tmp1);
                            }
                        } else {
                            this.modelInfo.spec_sub_temp1 = {
                                root: null,
                                text: "",
                                value: "",
                            }
                        }
                        //this.spec_sub_temp1 = this.items[0].spec[0].specdetails;                       
                        this.modelInfo.spec1_title = specTit[0];

                        //this.spec_sub_temp2 = "";
                        this.modelInfo.spec2_title = "";
                        if (this.modelInfo.spec_total > 1) {
                            //this.spec_sub_temp2 = this.items[0].spec[1].specdetails;
                            if (this.items[0].spec.length > 0) {
                                for (var i = 0; i < this.items[0].spec.length; i++) {
                                    //this.spec_sub_temp2 = this.items[0].spec[i].specdetails;
                                    for (var j = 0; j < this.items[0].spec[i].specdetails.length; j++) {
                                        var _tmp2 = {
                                            root: this.items[0].spec[i].specdetails[j].root,
                                            text: this.items[0].spec[i].specdetails[j].text,
                                            value: this.items[0].spec[i].specdetails[j].value,
                                        }
                                        this.modelInfo.spec_sub_temp2.push(_tmp2);

                                    }
                                }
                            } else {
                                this.modelInfo.spec_sub_temp2 = {
                                    root: null,
                                    text: "",
                                    value: "",

                                }
                            }

                            this.modelInfo.spec2_title = specTit[1];
                        }


                    }




                })
        }
        //最愛
        this.getFavPro();

        if ($("body.favorite.showspecdir").length > 0) {
            if (memberNum > 0) {
                axios
                    .get(rootUrl + 'api/GetFavoriteProduct/' + memberNum)
                    .then((response) => {

                        if (response.data != "") {
                            this.favoriteInfo.favlist = response.data.list;
                        }
                    })
            }
            

        }



        //地址
        if ($(".address-box").length > 0) {
            axios
                .get(rootUrl + 'api/RegionData/0-' + nationStr)
                .then((response) => {

                    this.cartFormData.address.city = response.data.addressdata;
                    
                    if ($(".home-contact-area.contact-form-required").length > 0) {
                        this.newaddress.newaddress_city = response.data.addressdata;
                    }


                })
        }



        //購物車

        this.getCartProduct();

        

        if ($("body").hasClass("cart") || $(".uc-checkout-section").length > 0) {
            if ($("body.cart").hasClass("cart_list") || $(".uc-checkout-section").length > 0) {

                

                //檢查是否登入會員
                axios
                    .get(rootUrl + 'api/checkMemberisLogin/')
                    .then((response) => {

                        this.formData.name = response.data.name;
                        this.formData.phone = response.data.phone1;
                        this.formData.email = response.data.u_id;
                        this.formData.sex1 = response.data.sex;
                    })

                //檢查購物車內有無商品
                if (this.cartItems.length > 0) {
                    $(".dsection").removeClass("defaultHidden");
                    //付款方式
                    if ($(".pay-kind").length > 0) {
                        axios
                            .get(rootUrl + 'api/PayKindData/0-' + nationStr + "-Y")
                            .then((response) => {

                                this.cartFormData.pay_method = response.data.paymentdetails;
                                //console.log(this.paykind);


                            })
                    }


                    ////運費 (檢查商品 + 區域)
                    //this.freightGet();


                } else {
                    $(".dsection").addClass("defaultHidden");
                    if ($("body.home").length <= 0) {
                        alert("購物車內無商品，請至商品專區選購商品。");
                        window.location.replace(rootUrl + "page/product/index.aspx");
                    }
                }




            }


            //交易完成頁
            if ($("body.cart").hasClass("finish")) {

               

                axios
                    .get(rootUrl + 'api/LoadOrderData/' + getUrlVars()["order_no"] + "-" + getUrlVars()["check_code"] + "-" + nationStr)
                    .then((response) => {

                        //交易完成頁，刪除localStorage
                        localStorage.removeItem(currPageWebOrderName);

                        this.finalInfo.orderdetail.order_no = response.data.orderdetails[0].order_no;
                        this.finalInfo.orderdetail.reg_time = response.data.orderdetails[0].reg_time;
                        this.finalInfo.orderdetail.name1 = response.data.orderdetails[0].name1;
                        this.finalInfo.orderdetail.sex1 = (response.data.orderdetails[0].sex1 == "男") ? "先生" : "小姐";
                        this.finalInfo.orderdetail.email = response.data.orderdetails[0].email;
                        this.finalInfo.orderdetail.name2 = response.data.orderdetails[0].name2;
                        this.finalInfo.orderdetail.sex2 = (response.data.orderdetails[0].sex2 == "男") ? "先生" : "小姐";
                        this.finalInfo.orderdetail.postnumber = response.data.orderdetails[0].postnumber;
                        this.finalInfo.orderdetail.city_text = response.data.orderdetails[0].city_text;
                        this.finalInfo.orderdetail.area_text = response.data.orderdetails[0].area_text;
                        this.finalInfo.orderdetail.address = response.data.orderdetails[0].address;
                        this.finalInfo.orderdetail.total_price = response.data.orderdetails[0].total_price;
                        this.finalInfo.orderdetail.pro_price = response.data.orderdetails[0].pro_price;
                        this.finalInfo.orderdetail.pay_kind = response.data.orderdetails[0].pay_kind;

                        this.finalInfo.productdetail = response.data.productdetails;
                        this.finalInfo.feedetail = response.data.feedetails;
                        this.finalInfo.paydetail = response.data.paydetails;

                        //寄信
                        if ($(".sendmail-val").val() != "") {

                            var jsonFormDetail = "";
                            var pro_order_detail = {
                                order_no: getUrlVars()["order_no"],
                                check_code: getUrlVars()["check_code"],
                                nation: nationStr,
                                mem_num: memberNum,
                                mem_uid: $(".mem_uid-val").val(),
                                total_price: this.finalInfo.orderdetail.total_price, //總金額(含運費、促銷、手續費等等)
                                pro_price: this.finalInfo.orderdetail.pro_price,
                                proDetail: this.finalInfo.productdetail,
                                otherFee: this.finalInfo.feedetail,
                                payDetail: this.finalInfo.paydetail
                            }

                            jsonFormDetail = JSON.stringify(pro_order_detail);


                            axios
                                .post(rootUrl + 'api/sendOrderMail', pro_order_detail)
                                .then((response) => {

                                    //寄信
                                    this.finalInfo.tadeStatus = response.data

                                })
                        }




                    })

            }


            //infinite
            if ($("body.infiniteMode").length > 0) {
                this.BindRepeater();
            }

        }

        //會員
        if ($("body.member").hasClass("login")) {
            $(".required").hide();
        }


        //留言
        if ($("body.hasTalk").length > 0) {

            this.getTalkList();
        }

        //折價券
        //if ($("body.coupon_list:not(.a03)").length > 0 || $("body.home .uc-checkout-section").length > 0) {
        if ($("body.coupon_list .order-all-coupon").length > 0) {
            this.getCoupons();
        }
        if ($("body.coupon_list  .order-filter-coupon").length > 0) {
            this.getCoupons('N');
        }
        //if ($("body.coupon_list.a03").length > 0 || $("body.home .uc-checkout-section").length > 0) {
        //if ($("body.coupon_list.a03").length > 0) {
        //    this.getCoupons('N');
        //}

        if (this.cartItems.length >= 0) {
            if ($(".wid-float-section").length > 0 && $(".wid-float-section ul li a .num").length > 0) {
                $(".wid-float-section ul li a .num").removeClass("d-none");
                $(".nav-cart-info .cart-drop-box .count").removeClass("d-none");
            }
        }
    },
    validations: {
        formData: {
            name: { required },
            phone: { required, telValidator },
            email: { required, email },
            pay_method: { required },
            name2: { required },
            phone2: { required, telValidator },
        },
        cartFormData: {
            address: {
                selected: { required },
                selected_item: { required },
                address_txt: { required }
            }
        },
        addressZip: { required }
    },
    methods: {

        /*address*/
        sendHomeContact: function (ranNum) {

            var chkForm = false;
            //console.log($(obj).parent());
            var wrap_box = $(".home-contact-area.contact-form-required[data-rannum=" + ranNum + "]");
            var required_obj = wrap_box.find(".required");

            var foreverStatus = false;

            required_obj.each(function () {

                //input
                if ($(this).prev("input").length > 0) {
                    if ($(this).prev("input").val() === "") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }

                //textarea
                if ($(this).prev("textarea").length > 0) {
                    if ($(this).prev("textarea").val() === "") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }

                //select
                if ($(this).prev("select").length > 0) {
                    if ($(this).prev("select").val() === "") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }


                //email
                if ($(this).parents(".email-box").length > 0) {
                    if ($(this).parents(".email-box").find("input").val() === "") {
                        $(this).show();
                    } else {
                        if (isEmail($(this).parents(".email-box").find("input").val())) {
                            $(this).next(".format").hide();
                            $(this).hide();
                        } else {
                            $(this).next(".format").show();
                        }
                    }
                }


                //radio
                if ($(this).prev(".radio-box").length > 0) {
                    if ($(this).prev(".radio-box").find("input:checked").length > 0) {
                        $(this).hide();
                        if ($(this).prev(".radio-box").find("input:checked").val() === "") {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    } else {
                        $(this).show();
                    }
                }


                //checkbox
                if ($(this).prev(".check-box").length > 0) {
                    if ($(this).prev(".check-box").find("input:checked").length > 0) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                }


                //address
                if ($(this).parents(".address-box").length > 0) {
                    if ($(this).parents(".address-box").find(".cityObj").val() === "") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                    if ($(this).parents(".address-box").find(".areaObj").val() === "") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                    if ($(this).parents(".address-box").find(".postObj").val() === "") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                    if ($(this).parents(".address-box").find(".addressObj").val() === "") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }


                //單行
                if ($(this).prev("input").length > 0 && $(this).prev("input").val() !== "") {
                    chkForm = true; 
                    
                } else {
                    chkForm = false;
                }
                //其他
                if (chkForm) {
                    if (($(this).prev("select").length > 0 && $(this).prev("select").val() !== "") ||
                        ($(this).prev(".radio-box").find("input:checked").length > 0 && $(this).prev(".radio-box").find("input:checked").val() !== "") ||
                        ($(this).prev(".check-box").find("input").length > 0 && $(this).prev(".check-box").find("input").val() !== "") ||
                        ($(this).parents(".address-box").find(".cityObj").length > 0 && $(this).parents(".address-box").find(".cityObj").val() !== "") ||
                        ($(this).parents(".address-box").find(".areaObj").length > 0 && $(this).parents(".address-box").find(".areaObj").val() !== "") ||
                        ($(this).parents(".address-box").find(".postObj").length > 0 && $(this).parents(".address-box").find(".postObj").val() !== "") ||
                        ($(this).parents(".address-box").find(".addressObj").length > 0 && $(this).parents(".address-box").find(".addressObj").val() !== "") ||
                        ($(this).prev("textarea").length > 0 && $(this).prev("textarea").val() !== "")) {
                        chkForm = true;
                    } else {

                        if ($(this).prev("input").length > 0) {
                            if ($(this).prev("input").val() !== "") {
                                chkForm = true;
                            } else {
                                chkForm = false;
                            }
                        } else {
                            chkForm = false;
                        }
                        //return false;
                    }
                }
            });

            




            if (chkForm) {
                //alert("Success");
                var formfill = [];
                var formfilllist = [];



                //input

                var eachItem = wrap_box.find(".mainformWrap");

                eachItem.each(function (index) {

                    var currChk = this.querySelector('.form-group');

                    //textbox

                    if ($(currChk).hasClass("textbox-wrap")) {
                        var titleStr = "", dataStr = "", typeStr = "", replyStr = "";
                        //mainformWrap

                        titleStr = $.trim($(currChk).parents(".mainformWrap").find('.label-title').text().replace("*", ""));
                        dataStr = $(currChk).find(".value-fill").val();
                        typeStr = $(currChk).data("type");
                        
                        if (typeStr === "TextBoxEmail" && $(currChk).find("input[type=hidden]").length > 0) {
                            replyStr = $(currChk).find(".value-fill").val();
                        }
                        var obj = {
                            title: titleStr,
                            data: dataStr,
                            type: typeStr,
                            replyTo: replyStr,
                            range: (index + 1)
                        }
                        formfill.push(obj);
                    }

                    //select
                    if ($(currChk).hasClass("dropdown-wrap")) {
                        var titleStr = "", dataStr = "", typeStr = "", replyStr = "";

                        titleStr = $.trim($(currChk).parents(".mainformWrap").find('.label-title').text().replace("*", ""));
                        dataStr = $(currChk).find(".value-fill").val();
                        typeStr = $(currChk).data("type");
                        
                        var obj = {
                            title: titleStr,
                            data: dataStr,
                            type: typeStr,
                            replyTo: replyStr,
                            range: (index + 1)
                        }
                        formfill.push(obj);
                    }

                    //radio
                    if ($(currChk).hasClass("radiobtn-wrap")) {

                        var titleStr = "", dataStr = "", typeStr = "", replyStr = "";

                        titleStr = $.trim($(currChk).parents(".mainformWrap").find('.label-title').text().replace("*", ""));
                        dataStr = $(".home-contact-area.contact-form-required[data-rannum=" + ranNum + "] .radiobtn-wrap input:checked").next("label").text();;
                        typeStr = $(currChk).data("type");

                        var obj = {
                            title: titleStr,
                            data: dataStr,
                            type: typeStr,
                            replyTo: replyStr,
                            range: (index + 1)
                        }
                        formfill.push(obj);
                    }

                    //textarea
                    if ($(currChk).hasClass("textmulti-wrap")) {
                        var titleStr = "", dataStr = "", typeStr = "", replyStr = "";

                        titleStr = $.trim($(currChk).parents(".mainformWrap").find('.label-title').text().replace("*", ""));
                        dataStr = $(currChk).find(".value-fill").val();
                        typeStr = $(currChk).data("type");

                        var obj = {
                            title: titleStr,
                            data: dataStr,
                            type: typeStr,
                            replyTo: replyStr,
                            range: (index + 1)
                        }
                        formfill.push(obj);
                    }

                    //checkbox
                    if ($(currChk).hasClass("checkbtn-wrap")) {
                        var titleStr = "", dataStr = "", typeStr = "", replyStr = "";

                        $(".home-contact-area.contact-form-required[data-rannum=" + ranNum + "] .checkbtn-wrap input:checkbox:checked").each(function (index, dolElem) {
                            dataStr += $.trim($(dolElem).next("label").text()) + ",";
                        });

                        titleStr = $.trim($(currChk).parents(".mainformWrap").find('.label-title').text().replace("*", ""));
                        typeStr = $(currChk).data("type");

                        var obj = {
                            title: titleStr,
                            data: dataStr,
                            type: typeStr,
                            replyTo: replyStr,
                            range: (index + 1)
                        }
                        formfill.push(obj);
                    }

                    //address
                    if ($(currChk).hasClass("address-wrap")) {

                        var titleStr = "", dataStr = "", typeStr = "", replyStr = "", cityStr = "", areaStr = "", postStr = "", addrStr = "", completeAddrStr = "";


                        titleStr = $.trim($(currChk).parents(".mainformWrap").find('.label-title').text().replace("*", ""));
                        typeStr = $(currChk).data("type");


                        cityStr = $.trim($(currChk).find('.cityObj').find('option:selected').text());
                        areaStr = $.trim($(currChk).find('.areaObj').find('option:selected').text());
                        postStr = $.trim($(currChk).find('.postObj').val());
                        addrStr = $.trim($(currChk).find('.addressObj').val());

                        completeAddrStr = postStr + cityStr + areaStr + addrStr;

                        dataStr = completeAddrStr;


                        //typeStr = this.dataset.type;
                        var obj = {
                            title: titleStr,
                            data: dataStr,
                            type: typeStr,
                            replyTo: replyStr,
                            range: (index + 1)
                        }
                        formfill.push(obj);
                    }

                });

                //console.log(formfill);

                var formDetails = {
                    nation: nationStr,
                    form_num: $(".home-contact-area.contact-form-required[data-rannum=" + ranNum + "]").data("mfnum"),
                    form_details: formfill,
                    captcha: $(".captcha").val(),
                    isRecap: ($(".picCap-fill").length > 0) ? "N" : "Y"
                }

                var natStr = nationStr;

                //console.log(formfill);
                axios.post(rootUrl + 'api/sendContact', formDetails)
                    .then(function (response) {
                        if (response.data.isOk) {
                            $("input").val("");
                            $(".areaObj").html("");
                            $(".areaObj").append("<option value=''></option>");
                            $("input[type=checkbox]").prop("checked", false);
                            $(".textareaObj").val("")
                            $("select").val("");
                            $("input[type=radio]").prop("checked", false);
                        }
                        msgbox(response.data.msgTxt);

                        $(".orination-val").val(natStr);
                        $(".nation-val").val(natStr);
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });


            }

        },
        /* news/product filter */
        checkkind: function (event) {
            //console.log(event.target.value);

            var apiurl = "";

            if ($("body.news.vue_filter").length > 0) {
                var newsKind = $('.side input:checkbox:checked[name="newscat"]').map(function () { return $(this).val(); }).get().toString();

                var apiurl = '/api/NewsFilter/0.' + nationStr;
                if (newsKind !== null && newsKind !== "") {
                    apiurl = '/api/NewsFilter/' + newsKind + "." + nationStr;
                }
            }

            if ($("body.product.vue_filter").length > 0) {
                if (this.prolayout1) {
                    this.prolayout1 = false;
                }

                var proKind = $('.side input:checkbox:checked[name="newscat"]').map(function () { return $(this).val(); }).get().toString();

                var apiurl = 'api/ProductKindFilter/0-' + nationStr + "-" + listsort;
                if (proKind != null && proKind != "") {
                    apiurl = 'api/ProductKindFilter/' + proKind + "-" + nationStr + "-" + listsort;
                }
            }



            axios
                .get(rootUrl + apiurl)
                .then((response) => {
                    this.filter_info.filterdata = response.data;
                    //console.log(this.newsdata);
                    this.FilterSetPage(1);
                })

        },
        /*** PAGE ***/
        setPage: function (idx) {

            if (this.prolayout1) {
                this.prolayout1 = false;
            }

            if (idx <= 0 || idx > this.totalPage) {
                return;
            }
            this.currPage = idx;
        },

        FilterSetPage: function (idx) {
            if (idx <= 0 || idx > this.filter_info.totalPage) {
                return;
            }
            this.filter_info.currPage = idx;
        },

        /*** PAGE ***/
        checkoutLayout: function () {
            if (this.checkout1) {
                this.checkout1 = false;
                this.checkout2 = true;
            }
        },
        qtyadd: function (e = "") {

            if (e !== "") {
                e.qty++;
                if (e.qty <= 0) e.qty = 1
                //更新 webstorage
                this.saveToWebStorage(e, "Y"); //即時更新數字
            } else {
                this.modelInfo.qty++;
                if (this.modelInfo.qty <= 0) this.modelInfo.qty = 1
            }

           
            //紅利
            if (bonusInfo.bonus_isused) {
                this.usebonusfun();
            }
            //折價券
            if (couponInfo.coupon_isused) {
                this.usableCoupons();
            }
            //訂單頁重新跑商品
            this.getCartProduct();


            //if (e !== "") {
                
            //    //更新 webstorage
            //    this.saveToWebStorage(e, "Y")//即時更新數字
            //    e.qty++;
            //    if (e.qty <= 0) e.qty = 1
                

            //} else {
            //    this.modelInfo.qty++;
            //    if (this.modelInfo.qty <= 0) this.modelInfo.qty = 1
                
            //}

            ////運費
            //this.freightGet();

            ////紅利
            //if (bonusInfo.bonus_isused) {
            //    this.usebonusfun();
            //}
            ////折價券
            //if (couponInfo.coupon_isused) {
            //    this.usableCoupons();
            //}

            ////訂單頁重新跑商品
            //this.getCartProduct();

            //this.cartItems = tmp;
        },
        qtyminus: function (e = "") {

            if (e !== "") {
                e.qty--;
                if (e.qty <= 0) e.qty = 1
                //更新 webstorage
                this.saveToWebStorage(e, "Y"); //即時更新數字
            } else {
                this.modelInfo.qty--;
                if (this.modelInfo.qty <= 0) this.modelInfo.qty = 1
            }

            
            //紅利
            if (bonusInfo.bonus_isused) {
                this.usebonusfun();
            }
            //折價券
            if (couponInfo.coupon_isused) {
                this.usableCoupons();
            }


            //訂單頁重新跑商品
            this.getCartProduct();

        },
        qtyTextChange: function (e) {

            if (isNaN(e.qty) || e.qty == "") {
                e.qty = 1;
            }

            //更新 webstorage
            this.saveToWebStorage(e, "Y"); //即時更新數字
            
            //紅利
            if (bonusInfo.bonus_isused) {
                this.usebonusfun();
            }
            //折價券
            if (couponInfo.coupon_isused) {
                this.usableCoupons();
            }

            //訂單頁重新跑商品
            this.getCartProduct();
        },
        del: function (prodIndex) {
            

            tmp.splice(prodIndex, 1);

            if (getWithExpiry(currPageWebOrderName) === null) {
                tmp = [];
            } else {
                //更新localStorage
                if (tmp.length > 0) {
                    setWithExpiry(currPageWebOrderName, JSON.stringify(tmp), expiredTime);
                } else {
                    localStorage.removeItem(currPageWebOrderName);
                    this.cartdetlist = [];
                }

            }

            //重新抓商品
            this.getCartProduct();

            if (this.cartItems.length <= 0 && !isOnePage) {
                alert("購物車內無商品，請至商品專區選購商品。");
                window.location.replace(rootUrl + "page/product/index.aspx");
            }

        },
        getFavPro() {
            //如果有我的最愛相關
            if ($("body").hasClass("has_favorite") || $(".btn-fav").length > 0) {

                if (memberNum > 0) {
                    axios
                        .get(rootUrl + 'api/GetFavorite/' + memberNum)
                        .then((response) => {

                            if (response.data != "") {
                                for (var i = 0; i < response.data.list.length; i++) {
                                    $(".fav_" + response.data.list[i].pro_id).addClass("done");
                                }
                            }

                        })
                }

                
            }
        },
        //加到最愛
        addFavorite(proID) {

            //送出表單
            var pro_detail = {
                nation: nationStr,
                mem_num: memberNum,
                pro_id: proID
            }


            axios.post(rootUrl + 'api/addFavorite', pro_detail)
                .then(function (response) {

                    var strMsg = response.data.memfavdetails.text;
                    if (!response.data.memfavdetails.isLogin) {
                        msgbox(strMsg, '', rootUrl + 'page/member/login.aspx');
                    } else {
                        msgbox(strMsg);

                        if ($(".fav_" + proID).hasClass("done")) {
                            $(".fav_" + proID).removeClass("done");
                        } else {
                            $(".fav_" + proID).addClass("done");
                        }

                    }


                })
                .catch(function (error) {
                    console.log(error.response);
                });

        },
        //加到產品比較
        addCompare(proID) {

            //記在localStorage
            //先清空
            this.modelInfo.id = '';
            this.modelInfo.name = '';
            this.modelInfo.spec1 = [];
            this.modelInfo.spec2 = [];
            this.modelInfo.spec1_txt = '';
            this.modelInfo.spec2_txt = '';
            this.modelInfo.spec_total = 0;
            this.modelInfo.spec_sub_temp1 = [];
            this.modelInfo.spec_sub_temp2 = [];
            this.modelInfo.price = '';
            this.modelInfo.image = '';
            this.modelInfo.qty = 1;
            this.modelInfo.pro_num = '';

            axios
                .get(rootUrl + 'api/ProductFilter/' + proID)
                .then((response) => {
                    //this.newsdata = response.data;
                    //console.log(this.newsdata);

                    var chkRequired = true;
                    var temp = "N";
                    this.items = response.data.productdetails;
                    //console.log(this.items);

                    var specTit = this.items[0].specTitle.split(',');

                    this.modelInfo.id = this.items[0].num;
                    this.modelInfo.name = this.items[0].name;
                    this.modelInfo.price = this.items[0].price;

                    this.modelInfo.spec1 = this.items[0].spec;

                    this.modelInfo.spec_total = this.items[0].specTotal;

                    this.modelInfo.pro_num = this.items[0].pro_num; //商品料號

                    this.modelInfo.image =  this.items[0].image;
                    this.modelInfo.tempProStatus = "N";

                    if (chkRequired) {
                        let itemToAdd = this.modelInfo;
                        var cartItem = JSON.stringify(itemToAdd);
                        this.saveCompareToWebStorage(itemToAdd, "N", $("#ctl00_HiddenField1").val() + "_compare_products", temp); //儲存至webStorage
                        //this.cartItems = tmp;

                    }

                })

        },
        //移除產品比較
        delCompare: function (prodIndex) {

            var compareWebStorageName = $("#ctl00_HiddenField1").val() + "_compare_products";

            var comProArry = JSON.parse(getWithExpiry(compareWebStorageName));

            comProArry.splice(prodIndex, 1);

            if (getWithExpiry(compareWebStorageName) === null) {
                tmp = [];
            } else {
                //更新localStorage
                if (comProArry.length > 0) {
                    setWithExpiry(compareWebStorageName, JSON.stringify(comProArry), expiredTime);
                } else {
                    localStorage.removeItem(compareWebStorageName);
                }

            }

            //重新抓商品

            var pro_com_pass = {
                proDetail: comProArry
            }


            axios
                .post(rootUrl + 'api/productCompare', pro_com_pass)
                .then((response) => {

                    if (response.data !== "") {
                        this.product_compare_info.product_list = response.data.list;
                        this.product_compare_info.product_compare_view = true;
                    } else {
                        this.product_compare_info.product_compare_view = false;
                    }

                })


        },
        compareItemClicked: function (item, tempStatus = "N") {

            //console.log(this.modelInfo.spec2);

            //設定該產品
            //console.log(item);


            //如果連續點擊相同商品，不需要重新呼叫 api
            this.getUniqProduct(item, tempStatus);


            //$("#my-modal").modal('show');
        },
        itemClicked: function (item, tempStatus = "N", modalObj ="#myModal") { //open model

            //console.log(this.modelInfo.spec2);

            //設定該產品
            //console.log(item);


            //如果連續點擊相同商品，不需要重新呼叫 api
            this.getUniqProduct(item, tempStatus, modalObj);

            /*var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
                keyboard: false
            })
            myModal.show();*/
            //$("#myModal").modal('show');
        },
        addToCart(itemToAdd, redirect = "N", temp = "N", modalObj ="#myModal") {
            let found = false;
            var chkRequired = false;
            var specTotal = this.modelInfo.spec_total;

            let ori_qty = this.modelInfo.qty;

            //有規格
            if (specTotal > 0) {

                if ($("body.product").hasClass("show")) { //詳細頁
                    if ($(".specification.radio-text-st").length > 0) {
                        if ($(".specKind1 input[type='radio']:checked + label").text() !== '') {
                            this.modelInfo.spec1_txt = $(".specKind1 input[type='radio']:checked + label").text();
                            this.modelInfo.spec2_txt = "";
                            this.modelInfo.spec_atext = $(".specKind1 input[type='radio']:checked + label").text() + "/";
                            this.modelInfo.spec_aValue = $(".specKind1 input[type='radio']:checked").val().split('=')[0] + "==";

                            if (specTotal > 1) {
                                if ($(".specKind2 input[type='radio']:checked + label").text() !== '') {
                                    this.modelInfo.spec2_txt = $(".specKind2 input[type='radio']:checked + label").text();
                                    this.modelInfo.spec_atext += $(".specKind2 input[type='radio']:checked + label").text();
                                    this.modelInfo.spec_aValue += $(".specKind2 input[type='radio']:checked").val().split('=')[0];
                                } else {
                                    msgbox("請選擇規格");
                                }
                            } else {
                                this.modelInfo.spec_aValue += "0";
                            }

                        } else {
                            msgbox("請選擇規格");
                        }
                        


                    } else {

                        this.modelInfo.spec1_txt = $(".specKind1").find("option:selected").text();
                        this.modelInfo.spec2_txt = "";
                        this.modelInfo.spec_atext = $(".specKind1").find("option:selected").text() + "/";
                        this.modelInfo.spec_aValue = $(".specKind1").find("option:selected").val().split('=')[0] + "==";

                        if (specTotal > 1) {
                            this.modelInfo.spec2_txt = $(".specKind2").find("option:selected").text();
                            this.modelInfo.spec_atext += $(".specKind2").find("option:selected").text();
                            this.modelInfo.spec_aValue += $(".specKind2").find("option:selected").val().split('=')[0];
                        } else {
                            this.modelInfo.spec_aValue += "0";
                        }
                    }

                    this.modelInfo.pro_num = $(".pro-num").text();
                }

                if (this.modelInfo.spec1_txt === '') {
                    $(".msg.spec1").show();
                    chkRequired = false;
                } else {
                    $(".msg.spec1").hide();
                    chkRequired = true;
                }


                if (specTotal > 1) { //有 2 種規格
                    if (this.modelInfo.spec2_txt === '') {
                        $(".msg.spec2").show();
                        chkRequired = false;
                    } else {
                        $(".msg.spec2").hide();
                        chkRequired = true;
                    }
                }

            } else {
                chkRequired = true;
            }

            if (chkRequired && temp != "Y") {
                if (this.modelInfo.qty <= 0) {
                    $(".msg.mqty").show();
                    chkRequired = false;
                } else {
                    $(".msg.mqty").hide();
                    chkRequired = true;
                }
            }


            //check product 
            

            // Add the item or increase qty
            if (chkRequired) {

                
                this.saveToWebStorage(itemToAdd, "N", currPageWebOrderName, temp); //儲存至webStorage
                this.cartItems = tmp;

                $("body.member.favorite .cart-item[data-num='" + this.modelInfo.id + "'] .spec_avalue").val(this.modelInfo.spec_aValue);


                $(".msg").hide();

                //加入購物車成功
                if ($(modalObj).length > 0) {
                    $(modalObj).modal("hide");
                }
                

                //更新共用購物車
                if ($(".header .nav-cart-list").length > 0 || $(".uc-checkout-section").length > 0) {
                    this.getCartProduct();
                }

                if (redirect === "Y") {
                    window.location.replace(rootUrl + "page/cart/index.aspx");
                }


                this.modelInfo.qty = ori_qty;

            }
        },
        addToCartFav(proID, ontimeQty = "N", webstorageName = currPageWebOrderName) {

            //先清空
            this.modelInfo.id = '';
            this.modelInfo.name = '';
            this.modelInfo.spec1 = [];
            this.modelInfo.spec2 = [];
            this.modelInfo.spec1_txt = '';
            this.modelInfo.spec2_txt = '';
            this.modelInfo.spec_total = 0;
            this.modelInfo.spec_sub_temp1 = [];
            this.modelInfo.spec_sub_temp2 = [];
            this.modelInfo.price = '';
            this.modelInfo.image = '';
            this.modelInfo.qty = 1;
            this.modelInfo.pro_num = '';

            axios
                .get(rootUrl + 'api/ProductFilter/' + proID)
                .then((response) => {
                    //this.newsdata = response.data;
                    //console.log(this.newsdata);

                    var chkRequired = false;
                    var temp = "N";
                    this.items = response.data.productdetails;
                    //console.log(this.items);

                    var specTit = this.items[0].specTitle.split(',');

                    this.modelInfo.id = this.items[0].num;
                    this.modelInfo.name = this.items[0].name;
                    this.modelInfo.price = this.items[0].price;

                    this.modelInfo.spec1 = this.items[0].spec;

                    this.modelInfo.spec_total = this.items[0].specTotal;

                    this.modelInfo.pro_num = this.items[0].pro_num; //商品料號

                    this.modelInfo.image = this.items[0].image;
                    this.modelInfo.tempProStatus = "N";

                    if ($("body.member.favorite").length > 0) {
                        this.modelInfo.qty = parseInt($("body.member.favorite .cart-item[data-num=" + this.modelInfo.id + "] .qty-quantity").val());
                    }
                    //有規格
                    if (this.modelInfo.spec_total > 0) {
                        if (this.items[0].spec.length > 0) {
                            for (var i = 0; i < this.items[0].spec.length; i++) {
                                var _tmp1 = {
                                    root: 0,
                                    text: this.items[0].spec[i].text,
                                    value: this.items[0].spec[i].value,
                                }
                                this.modelInfo.spec_sub_temp1.push(_tmp1);
                            }
                        } else {
                            this.modelInfo.spec_sub_temp1 = {
                                root: null,
                                text: "",
                                value: "",
                            }
                        }
                        //this.spec_sub_temp1 = this.items[0].spec[0].specdetails;                       
                        this.modelInfo.spec1_title = specTit[0];

                        //this.spec_sub_temp2 = "";
                        this.modelInfo.spec2_title = "";
                        if (this.modelInfo.spec_total > 1) {
                            //this.spec_sub_temp2 = this.items[0].spec[1].specdetails;
                            if (this.items[0].spec.length > 0) {
                                for (var i = 0; i < this.items[0].spec.length; i++) {
                                    //this.spec_sub_temp2 = this.items[0].spec[i].specdetails;
                                    for (var j = 0; j < this.items[0].spec[i].specdetails.length; j++) {
                                        var _tmp2 = {
                                            root: this.items[0].spec[i].specdetails[j].root,
                                            text: this.items[0].spec[i].specdetails[j].text,
                                            value: this.items[0].spec[i].specdetails[j].value,
                                        }
                                        this.modelInfo.spec_sub_temp2.push(_tmp2);

                                    }
                                }
                            } else {
                                this.modelInfo.spec_sub_temp2 = {
                                    root: null,
                                    text: "",
                                    value: "",

                                }
                            }

                            this.modelInfo.spec2_title = specTit[1];
                        }


                        if (this.modelInfo.spec_aValue != "") {
                            chkRequired = true;
                        } else {
                            chkRequired = false;
                            alert("請先選擇規格");
                        }
                    } else {
                        chkRequired = true;
                    }

                    //數量
                    if (chkRequired) {
                        if (this.modelInfo.qty > 0) {
                            chkRequired = true;
                        } else {
                            chkRequired = false;
                            alert("請填寫數量");
                        }
                    }
                    if (chkRequired) {
                        let itemToAdd = this.modelInfo;
                        var cartItem = JSON.stringify(itemToAdd);
                        

                        this.saveToWebStorage(itemToAdd, "N", currPageWebOrderName, temp); //儲存至webStorage
                        this.cartItems = tmp;


                        //更新共用購物車
                        if ($(".header .nav-cart-list").length > 0 || $(".uc-checkout-section").length > 0) {
                            this.getCartProduct();
                        }

                    }

                })

        },
        delFav(proID) {
            var pro_detail = {
                nation: nationStr,
                mem_num: memberNum,
                pro_id: proID
            }
            axios.post(rootUrl + 'api/removeFavorite', pro_detail)
                .then(function (response) {

                    var strMsg = response.data.memfavdetails.text;
                    if (!response.data.memfavdetails.isLogin) {
                        msgbox(strMsg, '', rootUrl + 'page/member/login.aspx');
                    } else {
                        msgbox(strMsg);
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        },
        getUniqProduct(proID, tempStatus = "N",modalObj=null) {
            
            //先清空
            this.modelInfo.id = '';
            this.modelInfo.name = '';
            this.modelInfo.spec1 = [];
            this.modelInfo.spec2 = [];
            this.modelInfo.spec1_txt = '';
            this.modelInfo.spec2_txt = '';
            this.modelInfo.spec_total = 0;
            this.modelInfo.spec_aValue = "";
            this.modelInfo.spec_atext = "";
            this.modelInfo.spec_sub_temp1 = [];
            this.modelInfo.spec_sub_temp2 = [];
            this.modelInfo.price = '';
            this.modelInfo.image = '';
            this.modelInfo.qty = 1;
            if (tempStatus == "Y") {
                this.modelInfo.qty = 0;
            }
            this.modelInfo.pro_num = '';

            axios
                .get(rootUrl + 'api/ProductFilter/' + proID)
                .then((response) => {
                    //console.log(this.newsdata);


                    this.items = response.data.productdetails;
                    //console.log(this.items);

                    if (this.items.length > 0) {
                        var specTit = this.items[0].specTitle.split(',');

                        this.modelInfo.id = this.items[0].num;
                        this.modelInfo.name = this.items[0].name;
                        this.modelInfo.price = this.items[0].price;

                        this.modelInfo.spec1 = this.items[0].spec;

                        this.modelInfo.spec_total = this.items[0].specTotal;

                        this.modelInfo.pro_num = this.items[0].pro_num; //商品料號

                        this.modelInfo.image =  this.items[0].image;
                        this.modelInfo.tempProStatus = tempStatus;

                        //有規格
                        if (this.modelInfo.spec_total > 0) {
                            
                            if (this.items[0].spec.length > 0) {
                                for (var i = 0; i < this.items[0].spec.length; i++) {
                                    var _tmp1 = {
                                        root: 0,
                                        text: this.items[0].spec[i].text,
                                        value: this.items[0].spec[i].value,
                                    }
                                    this.modelInfo.spec_sub_temp1.push(_tmp1);
                                }
                            } else {
                                this.modelInfo.spec_sub_temp1 = {
                                    root: null,
                                    text: "",
                                    value: "",
                                }
                            }


                            //this.spec_sub_temp1 = this.items[0].spec[0].specdetails;                       
                            this.modelInfo.spec1_title = specTit[0];

                            //this.spec_sub_temp2 = "";
                            this.modelInfo.spec2_title = "";
                            if (this.modelInfo.spec_total > 1) {
                                if (this.items[0].spec.length > 0) {
                                    for (var i = 0; i < this.items[0].spec.length; i++) {
                                        //this.spec_sub_temp2 = this.items[0].spec[i].specdetails;
                                        for (var j = 0; j < this.items[0].spec[i].specdetails.length; j++) {
                                            var _tmp2 = {
                                                //root: this.items[0].spec[i].value,
                                                root: this.items[0].spec[i].specdetails[j].root,
                                                text: this.items[0].spec[i].specdetails[j].text,
                                                value: this.items[0].spec[i].specdetails[j].value,
                                            }
                                            this.modelInfo.spec_sub_temp2.push(_tmp2);

                                        }
                                    }
                                } else {
                                    this.modelInfo.spec_sub_temp2 = {
                                        root: null,
                                        text: "",
                                        value: "",

                                    }
                                }

                                this.modelInfo.spec2_title = specTit[1];
                            }
                        }
                        if (this.modelInfo.spec_total > 1) {
                            this.modelInfo.chkIfspecVal = (this.modelInfo.spec_sub_temp2 != '' && this.modelInfo.spec_sub_temp2.length > 0);
                        } else { this.modelInfo.chkIfspecVal = true; }

                        if (modalObj !== null) {
                            $(modalObj).modal('show');
                        }
                    }

                })
        },
        specInterlockChange(event, rindex, prorow) {
            var nowData = event.target.value;
            this.favoriteInfo.proRows = prorow;
            this.favoriteInfo.favprospec2 = this.favoriteInfo.favlist[parseInt(proRows)].spec.specdetails;
        },
        selectOnChange(event, index) {

            if (index === 1) {
                dataText = event.target.options[event.target.options.selectedIndex].text;
                if (event.target.value.indexOf("=") > 0) {
                    dataValue = event.target.value.split('=')[0];
                } else {
                    dataValue = event.target.value;
                }


                //if (event.target.options.selectedIndex == 1) {
                //    this.modelInfo.spec2 = this.spec_sub_temp1;
                //} else if (event.target.options.selectedIndex == 2) {

                //    this.modelInfo.spec2 = this.spec_sub_temp2;

                //} else {
                //    this.modelInfo.spec2 = [];
                //}

                this.modelInfo.spec2 = [];
                for (var i = 0; i < this.modelInfo.spec_sub_temp2.length; i++) {
                    if (this.modelInfo.spec_sub_temp2[i].root == dataValue)
                        this.modelInfo.spec2.push(this.modelInfo.spec_sub_temp2[i]);
                }
                this.modelInfo.spec2_txt = '';

            } else {
                data2Text = event.target.options[event.target.options.selectedIndex].text;
                data2Value = event.target.value;


            }

            if (this.modelInfo.spec_total > 1) {
                this.modelInfo.chkIfspecVal = (this.modelInfo.spec2 != '' && this.modelInfo.spec2.length > 0);
            } else { this.modelInfo.chkIfspecVal = true; }


            this.modelInfo.pro_num = event.target.options[event.target.options.selectedIndex].value.split('=')[1];
            this.modelInfo.spec_atext = dataText + "/" + data2Text;
            this.modelInfo.spec_aValue = dataValue + "==" + data2Value;
            if (data2Value == "") {
                this.modelInfo.spec_aValue = dataValue + "==0";
            }
        },
        saveToWebStorage(itemToAdd, ontimeQty = "N", webstorageName = currPageWebOrderName, tempStatus = "N") {

            
            var realSpecVal = "";
            var realSpecText = "";
            if (itemToAdd.spec_aValue !== "0==0" && itemToAdd.spec_aValue !== "" && typeof (itemToAdd.spec_aValue) !== "undefined") {
                realSpecVal = itemToAdd.spec_aValue;
            }
            if (itemToAdd.spec_atext !== "/" && itemToAdd.spec_atext !== "" && typeof (itemToAdd.spec_atext) !== "undefined") {
                realSpecText = itemToAdd.spec_atext
            }


            var cusData = {
                id: parseInt(itemToAdd.id),
                qty: itemToAdd.qty,
                pro_num: itemToAdd.pro_num,
                spec_aValue: realSpecVal,
                spec_atext: realSpecText,
                tempProStatus: itemToAdd.tempProStatus
            }
            var cartItem = JSON.stringify(cusData);

            /******/
            if (getWithExpiry(webstorageName) === null) {
                tmp = [];
            } else {
                tmp = JSON.parse(getWithExpiry(webstorageName));
                if (typeof (tmp.length) == "undefined") {
                    tmp = [];
                    tmp.push(JSON.parse(getWithExpiry(webstorageName)));
                }
            }
            /******/
          
            if (tmp.length === 0) {

                setWithExpiry(webstorageName, cartItem, expiredTime);
                tmp.push(JSON.parse(cartItem));

            } else {
                
                //檢查是否有相同的商品

                let itemInCart = tmp.filter(item => item.id === parseInt(itemToAdd.id) && item.spec_aValue === realSpecVal);
                let isItemInCart = itemInCart.length > 0;

                var oriQty = 0;
                if (isItemInCart) { oriQty = itemInCart[0].qty; }
               
             
                var proArry = [];
                proArry.push(itemToAdd);

                var pro_detail = {
                    original_qty: oriQty,
                    proDetail: proArry
                } 

               
                //檢查庫存
                //axios.post(rootUrl + '/api/checkProductStock', pro_detail)
                //    .then(function (response) {
                //        if (response.data === "Y") {
                            //有庫存
                            if (isItemInCart === false) {
                                tmp.push(JSON.parse(cartItem));
                            } else {
                                tmp.map(function (item) {
                                    if (item.id === parseInt(itemToAdd.id) && item.spec_aValue === realSpecVal) {

                                        if (ontimeQty === "N") {
                                            itemInCart[0].qty += parseInt(itemToAdd.qty);
                                            itemToAdd.qty = parseInt(itemInCart[0].qty);
                                        } else {
                                            //即時更新數字
                                            itemInCart[0].qty = parseInt(itemToAdd.qty);
                                            itemToAdd.qty = parseInt(itemInCart[0].qty);
                                        }

                                    }
                                    itemInCart[0].tempProStatus = itemToAdd.tempProStatus;


                                });


                            }

                            
                            setWithExpiry(webstorageName, JSON.stringify(tmp), expiredTime);

                            

                            //this.cartItems = tmp;

                        //} else {

                        //    //無庫存
                        //    msgbox(response.data);
                        //}


                    //})

                
            }

            this.cartItems = tmp;

            if ($('.toast').length > 0) {
                $('.toast').toast('show');
            }

        },
        saveCompareToWebStorage(itemToAdd, ontimeQty = "N", webstorageName = currPageWebOrderName, tempStatus = "N") {

            var realSpecVal = "";
            var realSpecText = "";
            if (itemToAdd.spec_aValue !== "0==0" && itemToAdd.spec_aValue !== "" && typeof (itemToAdd.spec_aValue) !== "undefined") {
                realSpecVal = itemToAdd.spec_aValue;
            }
            if (itemToAdd.spec_atext !== "/" && itemToAdd.spec_atext !== "" && typeof (itemToAdd.spec_atext) !== "undefined") {
                realSpecText = itemToAdd.spec_atext
            }


            var cusData = {
                id: itemToAdd.id,
                qty: itemToAdd.qty,
                pro_num: itemToAdd.pro_num,
                spec_aValue: realSpecVal,
                spec_atext: realSpecText,
                tempProStatus: itemToAdd.tempProStatus
            }

            var cartItem = JSON.stringify(cusData);

            var newArry = [];
            

            /******/

            if (getWithExpiry(webstorageName) === null) {

            } else {
                newArry = JSON.parse(getWithExpiry(webstorageName));
                
                if (typeof (newArry.length) == "undefined") {
                    newArry = [];
                    newArry.push(JSON.parse(getWithExpiry(webstorageName)));
                }
            }

            /********/

            

            if (newArry.length === 0) {
                setWithExpiry(webstorageName, cartItem, expiredTime);
                newArry.push(JSON.parse(cartItem));
            } else {
                //檢查是否有相同的商品
                let itemInCart = newArry.filter(item => item.id === parseInt(itemToAdd.id) && item.spec_aValue === realSpecVal);
                let isItemInCart = itemInCart.length > 0;

                if (isItemInCart === false) {
                    newArry.push(JSON.parse(cartItem));
                    setWithExpiry(webstorageName, JSON.stringify(newArry), expiredTime);
                } else {
                    
                    newArry.map(function (item) {
                        
                    });


                }

                
            }

        },
        getWebStorageData() {

        },
        FreightRulesModal() {
            if (this.cartFormData.freightRules.length == 0) {
                axios
                    .get(rootUrl + 'api/FreightRules/' + nationStr)
                    .then((response) => {

                        this.cartFormData.freightRules = response.data.freightdetails;
                        $("#freightRules").modal('show');
                    })
            } else {
                $("#freightRules").modal('show');
            }
            
        },
        paykindChange(event) {

            axios
                .get(rootUrl + 'api/PayKindData/' + event.target.value + "-" + nationStr + "-N" + "-price")
                .then((response) => {
                    this.cartFormData.payMsg = response.data.paymentdetails;

                    //帶出文字
                    axios
                        .get(rootUrl + 'api/PayKindData/' + event.target.value + "-" + nationStr + "-N" + "-text")
                        .then((response) => {
                            this.cartFormData.payInfoMsg = response.data.paymentdetails;
                        })

                    //選擇atm 須出現後五碼填寫
                    axios
                        .get(rootUrl + 'api/PayKindData/' + event.target.value + "-" + nationStr + "-N" + "-parameter")
                        .then((response) => {
                            //atm 後五碼
                            if (response.data.paymentdetails.length > 0) {
                                if (response.data.paymentdetails[0].text == "return_pay" && response.data.paymentdetails[0].data !== "") {
                                    this.cartFormData.isAtm = true;
                                } else {
                                    this.cartFormData.isAtm = false;
                                }
                            } else {
                                this.cartFormData.isAtm = false;
                            }
                            
                        })

                })

        },
        getAddressZip() {
            var areazip = '';
            let AreaZip = cartFormData.address.area.filter(item => item.value === cartFormData.address.selected_item);
            if (AreaZip.length <= 0) {
                areazip = ''
            } else {
                areazip = AreaZip[0].zip
            }
            this.addressZip = areazip;
        },
        address_detailsChange(event, drop="") {
            if (drop == "city") {

               
                var root = event.target.value;


                if (event.target.value !== "") {
                    axios
                        .get(rootUrl + 'api/RegionData/' + root + "-" + nationStr)
                        .then((response) => {
                            this.cartFormData.address.area = response.data.addressdata;
                            


                            this.cartFormData.address.selected_item = "";

                            //運費
                            //this.freightGet();


                        })

                } else {
                    this.cartFormData.address.selected_item = "";
                }
            } 
            this.freightGet();
            this.getAddressZip();
           
        },
        nextStepCheck(obj) {
            this.submitted = true;
            if (this.$v.$invalid) {
                alert('尚有必填欄位未填')
            } else {
                goNext(obj);
            }
        },
        checkSameAs: function (e) {
            var self = this;
            if (event.target.checked) {
                self.formData.name2 = self.formData.name;
                self.formData.sex2 = self.formData.sex1;
                self.formData.phone2 = self.formData.phone;
                axios
                    .get(rootUrl + 'api/getMemAddress/')
                    .then((response) => {
                        
                        if (response.data != "") {
                            self.cartFormData.address.selected = response.data.city_num;
                            self.addressZip = response.data.postnumber;
                            self.cartFormData.address.address_txt = response.data.address;
                            self.cartFormData.address.area = response.data.areadata;
                            if (response.data.areadata.length > 0) {
                                self.cartFormData.address.selected_item = response.data.area_num;
                            }
                        }
                    })

                $(".limit-ena").attr("disabled", "disabled");
            } else {
                $(".limit-ena").removeAttr("disabled");
               
            }
           
        },
        submitForm() {
            this.submitted = true;

            if (this.$v.$invalid) {
                alert('尚有必填欄位未填')
            } else {

                //再檢查一次localStorage
                //var certWebStorage = "";
                //if (window.location.href.indexOf("_onepage") > -1) {
                //    certWebStorage = onePageWebOrderName;
                //} else {
                //    certWebStorage = webOrderName;
                //}


                var jsonFormDetail = '';

                var addr_city = cartFormData.address.city.filter(item => item.value === cartFormData.address.selected)[0].value;
                var addr_area = cartFormData.address.area.filter(item => item.value === cartFormData.address.selected_item)[0].value;
                var addr_city_txt = cartFormData.address.city.filter(item => item.value === cartFormData.address.selected)[0].text;;
                var addr_area_txt = cartFormData.address.area.filter(item => item.value === cartFormData.address.selected_item)[0].text;
                //var postnum = cartFormData.address.area.filter(item => item.value === cartFormData.address.selected_item)[0].zip;

                var payMethod = cartFormData.pay_method.filter(item => item.value === formData.pay_method)[0].text;

                //重新抓一次商品
                //this.getCartProduct();

                //

                var bonus_used_total = 0;
                if (this.bonusInfo.bonuslist.length > 0) {
                    for (var i in this.bonusInfo.bonuslist) {
                        bonus_used_total += parseInt(this.bonusInfo.bonuslist[i].data);
                    }
                }

                if ($(".checkoutModal").length > 0) {
                    this.formData.sex1 = '';
                    this.formData.sex2 = '';
                }

                //console.log(bonus_used_total);

                //送出表單
                var pro_order_detail = {
                    nation: nationStr,
                    mem_num: memberNum,
                    mem_uid: $(".mem_uid-val").val(),
                    //total_price: this.cartFormData.totalPrice, //總金額(含運費、促銷、手續費等等)
                    pro_price: this.cartFormData.proPrice,
                    //proDetail: this.cartItems,
                    proDetail: this.cartdetlist,
                    form_details: [{
                        name1: this.formData.name,
                        sex1: this.formData.sex1,
                        phone1: this.formData.phone,
                        name2: this.formData.name2,
                        sex2: this.formData.sex2,
                        phone2: this.formData.phone2,
                        email: this.formData.email,
                        city: addr_city,
                        area: addr_area,
                        city_text: addr_city_txt,
                        area_text: addr_area_txt,
                        postnumber: this.addressZip,
                        address_text: this.cartFormData.address.address_txt,
                        pay_demo: this.formData.demo,
                        getTime: this.formData.get_time,
                        getHoliday: this.formData.get_holiday,
                        cNum: this.formData.c_num,
                        cTitle: this.formData.c_title,
                        payment: this.formData.pay_method,
                        pay_kind: payMethod,
                        atm_bank_code: this.cartFormData.atmBankCode

                    }
                    ], 
                    //bonusFee: this.bonusInfo.bonuslist,
                    use_bonus: bonus_used_total,
                    limit_bonus: this.bonusInfo.bonus_limit,
                    coupon_id: this.couponInfo.coupon_used,
                    cartLengthcount: this.cartdetlist.length,
                    is_one_page: isOnePage
                }

                //jsonFormDetail = JSON.stringify(pro_order_detail);


                //console.log(this.cartdetlist);

                axios.post(rootUrl + 'api/newOrder', pro_order_detail)
                    .then(function (response) {
                        //console.log(response);

                        //成功後，刪除localStorage
                        if (response.data.status) {
                            localStorage.removeItem(currPageWebOrderName);
                            cartdetlist = []; 
                            if ($("body").hasClass("home")) {
                                msgbox(response.data.strmsg, '',window.location.href);
                            } else {
                                msgbox(response.data.strmsg);
                                if ($("body.home").length <= 0) {
                                    window.location.replace(response.data.url);
                                } else {
                                    $("#checkoutModal").modal("hide");
                                }
                                
                                //alert('表單送出成功!');
                                
                            }

                            var pro_num = response.data.pro_num;
                            if (parseInt(pro_num) > 0) {
                                $(".cart-list .cart-item[data-id=" + pro_num + "]").find(".stockHint").addClass("d-none");
                            }

                            //location.href = "finish.aspx";
                        } else {

                            //庫存不足的商品
                            var pro_num = response.data.pro_num;
                            if (parseInt(pro_num) > 0) {
                                $(".cart-list .cart-item[data-id=" + pro_num + "]").find(".stockHint").removeClass("d-none");
                            }
                            if (response.data.url !== "") {
                                //msgbox(response.data.strmsg);
                                location.href = response.data.url;
                            } else {
                                msgbox(response.data.strmsg);
                            }
                            
                        }

                        
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });


                
            }


        },
        getCartProduct() {

            //console.log(this.cartItems);

            if ($("body").hasClass("cart") || $(".header .nav-cart-list").length > 0 || $(".uc-checkout-section").length > 0) {
                if ($("body.cart").hasClass("cart_list") || $(".header .nav-cart-list").length > 0 || $(".uc-checkout-section").length > 0) {

                    if (this.cartItems.length > 0) {

                        var cartArry = [];
                        cartArry = this.cartItems.filter(item => item.tempProStatus === 'N' || typeof (item.tempProStatus) === "undefined" || item.tempProStatus === '');

                        var cartProDet = {
                            proDetail: cartArry
                        }

                        if (cartArry.length > 0) {
                            axios
                                .post(rootUrl + 'api/getOrderProduct', cartProDet)
                                .then((response) => {

                                    if (response.data !== "") {
                                        this.cartdetlist = response.data.list;
                                        //console.log(this.cartdetlist);


                                        this.shopping_items = this.cartdetlist;



                                        //運費 (檢查商品 + 區域)
                                        this.freightGet();

                                        //如果有商品
                                        //檢查有無紅利
                                        if ($(".discount.bonus").length > 0) {
                                            var prototalprice = 0;

                                            //var sum = 0;
                                            for (var i in this.cartdetlist) {
                                                prototalprice += this.cartdetlist[i].price * this.cartdetlist[i].qty;
                                            }

                                            //console.log(prototalprice);

                                            axios
                                                .get(rootUrl + 'api/GetBonusInfo/' + prototalprice)
                                                .then((response) => {

                                                    this.bonusInfo.bonus_total = response.data.list.bonusTotal;
                                                    this.bonusInfo.bonus_limit = response.data.list.useBonus;

                                                    this.freightGet();  //運費 
                                                })
                                        }


                                        //折扣
                                        if (this.cartdetlist.length > 0) {
                                            //var sum = 0;
                                            for (var i in this.cartdetlist) {
                                                prototalprice += this.cartdetlist[i].price * this.cartdetlist[i].qty;
                                            }

                                            var cartInfo = {
                                                totalAmout: prototalprice,
                                                nation: nationStr,
                                                proDetail: this.cartdetlist
                                            }

                                            axios
                                                .post(rootUrl + 'api/getDiscount', cartInfo)
                                                .then((response) => {

                                                    if (response.data !== "") {
                                                        this.discountInfo.discountlist = response.data.list;
                                                    } else {
                                                        this.discountInfo.discountlist = [];
                                                    }

                                                    this.freightGet();  //運費 

                                                });
                                        }


                                    }


                                }).finally(() => {
                                    if ($(".cart-pg-loader").length > 0) {
                                        $(".cart-pg-loader").addClass("d-none");
                                    }
                                    
                                    //$(".cart-pg-section").removeClass("d-none");
                                });
                        }

                        
                    }


                    
                }
            }
        },
        status(validation) {
            return {
                error: validation.$error,
                dirty: validation.$dirty
            }
        },
        freightGet() {
            //運費 (檢查商品 + 區域)
          
            var jsonFormDetail = '';

            var addr_city = "";
            var addr_area = "";
            if (cartFormData.address.city.filter(item => item.value === cartFormData.address.selected).length > 0) {
                addr_city = cartFormData.address.city.filter(item => item.value === cartFormData.address.selected)[0].value
            }
            if (cartFormData.address.area.filter(item => item.value === cartFormData.address.selected_item).length > 0) {
                addr_area = cartFormData.address.area.filter(item => item.value === cartFormData.address.selected_item)[0].value
            }

            var getFreight_detail = {
                nation: nationStr,
                proDetail: this.cartItems,
                form_details: [{
                    city: addr_city,
                    area: addr_area
                }
                ],
                couponFee: this.couponInfo.couponUsedlist,
                discountFee: this.discountInfo.discountlist,
                bonusFee: this.bonusInfo.bonuslist
            }

            jsonFormDetail = JSON.stringify(getFreight_detail);

            axios
                .post(rootUrl + 'api/FreightData', getFreight_detail)
                .then((response) => {
                  
                    if (typeof (response.data.freightdetails) != "undefined") {
                        if (response.data.freightdetails != "N") {
                            this.cartFormData.freightData = response.data.freightdetails;
                        }
                    }
                })
        },

        //忘記密碼
        closeForgetModal() {
            this.memberInfo.u_id = '';
            this.checkcode = '';
            $(".wrong-msg").text('');
        },
        forgetPassword() {

            var isOK = false;

            if (this.memberInfo.u_id == null || this.memberInfo.u_id == "") {
                $(".msg.muid").show();
                $(".msg.muid_format").hide();
                //isOK = false;
            } else {
                
                $(".msg.muid").hide();
            }
            if (this.checkcode == null || this.checkcode == "") {
                $(".msg.mcck").show();
                //isOK = false;
            } else {
                $(".msg.mcck").hide();
                //isOK = true;
            }
            
            if (this.memberInfo.u_id != null && this.memberInfo.u_id != "" && this.checkcode != null && this.checkcode != "") {
                if (isEmail(this.memberInfo.u_id)) {
                    isOK = true;
                } else {
                    $(".msg.muid_format").show();
                    isOK = false;
                }
                //isOK = true;
            } else {
                isOK = false;
            }

            if (isOK) {

                var memberDetails = {
                    u_id: this.memberInfo.u_id,
                    checkcode: this.checkcode
                    
                }

                axios.post(rootUrl + 'api/ForgetMem', memberDetails)
                    .then(function (response) {
                        
                        //成功後，刪除localStorage
                        
                        var success = response.data.memdetails.status;
                        if (success) {
                            alert(response.data.memdetails.text);
                            $("#forgotFancybox").modal("hide");
                            this.memberInfo.u_id = '';
                            this.checkcode = '';
                            $(".wrong-msg").text('');
                        } else {
                            $(".wrong-msg").text(response.data.memdetails.text);
                        }


                        
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });

            }

        },
        //我的最愛


        //infinite scroll
        refreshInifKindData(kindNum,nation) {
            this.BindRepeater("album", kindNum, nation);
        },
        BindRepeater(objCategory,objKind,currNation) {

            var Details = {
                category: objCategory,
                kind: objKind,
                nation: currNation
            }

            axios.post(rootUrl + 'api/' + objCategory + 'RefreshInfiKind' , Details)
                .then(function (response) {
                    //console.log(response);

                    if (response.data !== "") {
                        var row = $(".infiniteScrollUpt > div:last-child").clone(true);
                        $(".infiniteScrollUpt > div:not(:last-child)").remove();
                        $(".infiniteScrollUpt > div:last-child").remove();

                        $(".total-page").html(response.data.totalPage);
                        $(".next-page").attr("href", rootUrl + "page/album/index03.aspx?page=" + (response.data.currPage + 1) + "&kind=" + response.data.mainKind);
                        $.each(response.data.list, function () {
                            var albumItem = $(this);
                            //$(".FirstImg", row).html($(this).find("FirstImg").text());
                            //$(".title", row).html(albumItem[0].subject);
                            row.find(".FirstImg").attr("src", rootUrl + "upload/album/" + albumItem[0].photo);
                            row.find(".title").html(albumItem[0].subject);
                            //$(".Country", row).html($(this).find("Country").text());
                            $(".infiniteScrollUpt").append(row);
                            row = $(".infiniteScrollUpt > div:last-child").clone(true);
                        });
                    }


                    initInfScroll(rootUrl + "page/album/index03.aspx?kind=" + response.data.mainKind + "&page=");

                })
                .catch(function (error) {
                    console.log(error.response);
                });


        },
       
        AddOpayback() {
            if (this.AtmbankInfo.bank_code != "" && this.AtmbankInfo.bank_code != null && typeof (this.AtmbankInfo.bank_code) != "undefined"
                && this.AtmbankInfo.bank_date != "" && this.AtmbankInfo.bank_date != null && typeof (this.AtmbankInfo.bank_date) != "undefined"
            ) {
                var order_detail = {
                    order_no: getUrlVars()["order_no"],
                    check_code: getUrlVars()["check_code"],
                    bank_code: this.AtmbankInfo.bank_code,
                    bank_date: this.AtmbankInfo.bank_date,
                }
                axios
                    .post(rootUrl + 'api/AddOpayback', order_detail)
                    .then((response) => {

                        if (response.data !== "") {
                            if (response.data.status) {
                                msgbox(response.data.msg);
                                this.AtmbankInfo.isshow =true;
                                $("#paybank_code").hide();
                                $("#paybank_date").hide();
                                $(".sendOpayback").hide();
                            } else {
                                if (response.data.url !== "") {
                                    location.href = response.data.url;
                                } else {
                                    msgbox(response.data.msg);
                                }
                            }

                        }


                    })
            } else {
                msgbox("尚未填寫資料");
            }
        },
        //留言
        getTalkList() {
            var talk_detail = {
                order_no: getUrlVars()["order_no"],
                check_code: getUrlVars()["check_code"],
                root: 0
            }


            axios
                .post(rootUrl + 'api/talkView', talk_detail)
                .then((response) => {

                    if (response.data !== "") {
                        this.talkInfo.talklist = response.data.list;
                        //$(".talk-content pre").text().trim();
                    }


                })
        },
        openTalkModal(talkNum) {
            this.talkInfo.talk_num = talkNum;
            this.talkInfo.words_txt = '';
            $("#myModal").modal('show');
        },
        addTalk(talkNum) {
            if (this.talkInfo.words_txt != "" && this.talkInfo.words_txt != null && typeof (this.talkInfo.words_txt) != "undefined") {
                var talk_detail = {
                    order_no: getUrlVars()["order_no"],
                    check_code: getUrlVars()["check_code"],
                    words: this.talkInfo.words_txt,
                    root: talkNum
                }
                axios
                    .post(rootUrl + 'api/AddTalk', talk_detail)
                    .then((response) => {

                        if (response.data !== "") {
                            if (response.data.status) {
                                msgbox(response.data.msg);
                                this.getTalkList();
                                //toggleTalkForm();
                                this.talkInfo.words_txt = '';
                                if ($(".talk-form").is(':visible')) {
                                    $(".talk-form").slideUp();
                                }
                                $("#myModal").modal('hide');
                            } else {
                                if (response.data.url !== "") {
                                    location.href = response.data.url;
                                } else {
                                    msgbox(response.data.msg);
                                }
                            }

                        }

                    })
            }
        },
        //常見問題
        openFaqAskModal() {
            $(".msg.required").hide();
            var currentKind = 0;
            if (urlQueryString["kind"] !== "" && typeof (urlQueryString["kind"]) !== "undefined") {
                currentKind = urlQueryString["kind"];
            }
            this.faqaskInfo.kind = parseInt(currentKind);

            axios
                .get(rootUrl + 'api/checkFaqAsk')
                .then((response) => {
                    
                    if (response.data === "N") {
                        msgbox("請先登入會員", rootUrl + "page/member/login.aspx");
                    } else if (response.data !== "") {
                        this.faqaskInfo.u_name = response.data.name;
                        this.faqaskInfo.email = response.data.u_id;
                        this.faqaskInfo.mem_num = parseInt(response.data.mem_num);
                    }


                })
            $("#myModal").modal('show');
        },
        FaqAsk() {

            var isOK = false;

            //check name
            if (this.faqaskInfo.u_name == null || this.faqaskInfo.u_name == "") {
                $(".msg.muname").show();
            } else {
                $(".msg.muname").hide();
            }

            //check email
            if (this.faqaskInfo.email == null || this.faqaskInfo.email == "") {
                $(".msg.muid").show();
                $(".msg.muid_format").hide();
            } else {
                $(".msg.muid").hide();
            }

            //check quest
            if (this.faqaskInfo.quest == null || this.faqaskInfo.quest == "") {
                $(".msg.muquest").show();
            } else {
                $(".msg.muquest").hide();
            }

            //check code
            if (this.checkcode == null || this.checkcode == "") {
                $(".msg.mcck").show();
            } else {
                $(".msg.mcck").hide();
            }

            if (this.faqaskInfo.u_name != null && this.faqaskInfo.u_name != "" && this.faqaskInfo.quest != null && this.faqaskInfo.quest != "" && this.faqaskInfo.email != null && this.faqaskInfo.email != "" && this.checkcode != null && this.checkcode != "") {
                if (isEmail(this.faqaskInfo.email)) {
                    isOK = true;
                } else {
                    $(".msg.muid_format").show();
                    isOK = false;
                }
            } else {
                isOK = false;
            }

            if (isOK) {
                var faq_detail = {
                    nation: $("nation-val").val(),
                    kind: this.faqaskInfo.kind,
                    name: this.faqaskInfo.u_name,
                    email: this.faqaskInfo.email,
                    mem_num: this.faqaskInfo.mem_num,
                    quest: this.faqaskInfo.quest
                }
                axios
                    .post(rootUrl + 'api/AddTalk', faq_detail)
                    .then((response) => {

                        if (response.data !== "") {
                            msgbox(response.data);
                            
                            $("#myModal").modal('hide');
                            this.closeFaqAskModal();
                        }

                    })
            }
            
        },
        closeFaqAskModal() {
            $(".msg.required").hide();
            this.faqaskInfo.quest = '';
            this.faqaskInfo.kind = 0;
            this.faqaskInfo.u_name = '';
            this.faqaskInfo.email = '';
            this.checkcode = '';
        },
        //紅利
        bonusChange(event) {
            if (event.target.value === "Y") {
                this.bonusInfo.bonus_isused = true;
            } else {
                this.bonusInfo.bonus_isused = false;
                this.bonusInfo.bonuslist = [];
                this.bonusInfo.bonus_used = "";
            }
        },
        usebonusfun() {
            var prototalprice = 0;
            for (var i in this.cartdetlist) {
                prototalprice += this.cartdetlist[i].price * this.cartdetlist[i].qty;
            }

            if (this.bonusInfo.bonus_used !== "" && $.isNumeric(this.bonusInfo.bonus_used)) {
                var bonus_detail = {
                    update_usePoint: true,
                    bonus_used: this.bonusInfo.bonus_used,
                    bonus_total: this.bonusInfo.bonus_total,
                    pro_total: prototalprice
                }
                axios
                    .post(rootUrl + 'api/bonusPrice', bonus_detail)
                    .then((response) => {

                        if (response.data.stsaus && response.data.msg === "") {

                            this.bonusInfo.bonuslist = response.data.list;

                            //$("#myModal").modal('hide');
                            //this.closeFaqAskModal();
                        } else {
                            msgbox(response.data.msg);
                            this.bonusInfo.bonuslist = [];
                            this.bonusInfo.bonus_used = "";
                        }

                    })
            }

        },
        //折價券
        checkCoupon(repload="N",repstsaus="") {

            if (this.couponInfo.coupon_input !== "") {
                $(".msg.required:not(.format)").hide();
                if (ValidateCNWord(this.couponInfo.coupon_input)) {
                    $(".msg.required.format").hide();
                    var coupon_detail = {
                        coupon_input: this.couponInfo.coupon_input
                    }
                    axios
                        .post(rootUrl + 'api/checkCoupon', coupon_detail)
                        .then((response) => {

                            if (response.data !== "") {
                                
                                if (repload === "Y") {
                                    msgbox(response.data, "", rootUrl + "page/coupon/index.aspx");
                                } else {
                                    msgbox(response.data);
                                    this.getCoupons(repstsaus);
                                }
                            }

                        })
                } else {
                    $(".msg.required.format").show();
                }


            } else {
                $(".msg.required:not(.format)").show();
            }

        },
        couponChange(event) {
            if (event.target.value === "Y") {
                this.couponInfo.coupon_isused = true;
                this.getCoupons("N");
            } else {
                this.couponInfo.coupon_isused = false;
                this.couponInfo.couponlist = [];
                this.couponInfo.couponUsedlist = [];
                this.couponInfo.coupon_used = "";
            }
            this.freightGet();
        },
        usableCoupons() {
            //可使用的折價券
            var prototalprice = 0;

            //var sum = 0;
            for (var i in this.cartdetlist) {
                prototalprice += this.cartdetlist[i].price * this.cartdetlist[i].qty;
            }

            var coupon_detail = {
                nation: nationStr,
                pro_price: prototalprice,
                coupon_id: this.couponInfo.coupon_used
            }
            axios
                .post(rootUrl + 'api/usableCoupon', coupon_detail)
                .then((response) => {

                    if (response.data.couponsStatus) {
                        this.couponInfo.couponUsedlist = response.data.list;
                    } else {
                        msgbox(response.data.msg);
                        this.couponInfo.couponUsedlist = [];
                        this.chooseCoupon("");
                        this.couponInfo.coupon_isused = false;
                        //$("#rad_nouseCoupon").attr("checked", "checked");
                    }
                    this.freightGet();
                })
        },
        chooseCoupon(event) {
            //console.log(event.target.value);
            if (event !== "") {
                this.couponInfo.coupon_used = event.target.value;
                this.usableCoupons();
            } else {
                this.couponInfo.coupon_used = "";
            }
        },
        getCoupons(cot="") {

            this.setPage(1);
            this.couponInfo.coupon_tabs_cot = cot;
            //讀取折價券
            var coupon_detail = {
                nation: nationStr,
                status_code: cot
            }

            axios
                .post(rootUrl + 'api/getCoupon', coupon_detail)
                .then((response) => {
                    this.couponInfo.coupon_active = response.data.couponsStatus;
                    if (response.data.couponsStatus) {
                        this.couponInfo.couponlist = response.data.list;
                    } else {
                        //msgbox(response.data.msg);
                        this.couponInfo.couponlist = [];
                    }
                })
        },
        //UC checkout
        UcCheckClick() {
            //付款方式
            if ($(".pay-kind").length > 0) {
                axios
                    .get(rootUrl + 'api/PayKindData/0-' + nationStr + "-Y")
                    .then((response) => {

                        this.cartFormData.pay_method = response.data.paymentdetails;
                        
                    })
            }
        },
        UcCheckOut(stepNum=0) {

            this.submitted = true;

            if (stepNum > 0) {
                stp = stepNum;
            }
            var chkRequired = false;

            switch (stp) {
                case 1:
                            
                    //if (this.formData.pay_method == null || this.formData.delivery_method == null) {
                    if (this.formData.pay_method == null) {
                        this.doneStep1 = false;
                        if (this.formData.pay_method === null) {
                            $(".msg.paymethod").show();
                        } else {
                            $(".msg.paymethod").hide();
                        }
                        
                    } else {
                        this.doneStep1 = true;
                        chkRequired = true;
                        $(".msg.paymethod").hide();
                        
                        stp = 2;
                    }
                    break;
                case 2:
                    //要再檢查一次
                    if (this.formData.pay_method == null) {
                        this.doneStep1 = false;
                        if (this.formData.pay_method === null) {
                            $(".msg.paymethod").show();
                        } else {
                            $(".msg.paymethod").hide();
                        }

                    } else {
                        if (stepNum <= 0 && !this.doneStep1) { stp = 1; } else { stp = 2; }
                        this.doneStep1 = true;
                        chkRequired = true;
                        $(".msg.paymethod").hide();
                        
                    }
                            

                    if (this.doneStep1) {

                        if (stepNum <= 0 && stp == 2) {
                            //if (this.$v.formData.name.$invalid || this.$v.formData.phone.$invalid || this.$v.cartFormData.address.address_txt.$invalid || $(".receipt_time .receipt_time_option").val() === "") {
                            if (this.$v.formData.name.$invalid || this.$v.formData.phone.$invalid) {
                                chkRequired = false; //當前資料
                                this.doneStep2 = false;
                                this.hasErrors = true;
                                $(".modal .msg").show();
                                stp = 2;
                            } else {
                                $(".modal .msg").hide();
                                chkRequired = true; //當前資料
                                this.doneStep2 = true;
                                stp = 3;
                                this.hasErrors = false;
                            }
                        } else {
                            chkRequired = true; // 檢查前一頁資料
                            stp = 2;
                        }
                    }
                            

                    break;
                case 3:
                    
                    //要再檢查一次
                    //if (this.$v.formData.name.$invalid || this.$v.formData.phone.$invalid || this.$v.cartFormData.address.address_txt.$invalid || $(".receipt_time .receipt_time_option").val() === "") {
                    if (this.$v.formData.name.$invalid || this.$v.formData.phone.$invalid) {
                        chkRequired = false; //當前資料
                        this.doneStep2 = false;
                        this.hasErrors = true;
                        $(".modal .msg").show();
                        
                    } else {
                        if (stepNum <= 0 && !this.doneStep2) { stp = 2; } else { stp = 3; }
                        chkRequired = true; //當前資料
                        this.doneStep2 = true;
                        this.hasErrors = false;
                        $(".modal .msg").hide();
                        this.submitted = false;
                    }
                            

                    if (this.doneStep2 && stp == 3) {
                        if (stepNum <= 0) {
                            if (this.$v.formData.email.$invalid) {
                                this.doneStep3 = false;
                                chkRequired = false;
                                this.hasErrors = true;
                                stp = 3;
                            } else {
                                this.doneStep3 = true;
                                chkRequired = true;
                                this.hasErrors = false;
                                stp = 4;
                            }
                        } else {
                            chkRequired = true; // 檢查前一頁資料
                            stp = 3;
                        }
                                
                    }
                    break;
                case 4: //前一次庫存不足會變 4 
                    chkRequired = true;
                    break;

            }
                    
            if (chkRequired) {
                this.submitted = false;
                if (stepNum > 0) {
                    stp = stepNum;
                }

                if (stp < 4) {
                    checkout(stp);
                } else {
                    this.submitForm();
                }

            } else {
                //alert('尚有必填欄位未填');
                        
            }


            console.log(stp);

            
        }


    },
    computed: {
        getTotal: function () {
            var sum = 0;
            for (var i in cartItems) {
                sum += cartItems[i].price * cartItems[i].qty;
            }
            return sum;
        },
        //cartFormData.address.area:
        addressZip: {
            get() {
                return this.cartFormData.addressZip;
            },
            set(newVal) {

                this.cartFormData.addressZip = newVal;
            }
        },
        /*** PAGE ***/
        filteredCouponRows: function () {
            // 因為 JavaScript 的 filter 有分大小寫，
            // 所以這裡將 filter_name 與 rows[n].name 通通轉小寫方便比對。
            //var filter_name = this.filter_name.toLowerCase();
            var filter_name = this.filter_name;

            // 如果 filter_name 有內容，回傳過濾後的資料，否則將原本的 rows 回傳。

                  return (this.filter_name.trim() !== '') ?
                    this.couponInfo.couponlist.filter(function (d) { return d.coupons_no.toLowerCase().indexOf(filter_name) > -1; }) :
                    this.couponInfo.couponlist;

        },
        pageStart: function () {
            return (this.currPage - 1) * this.countOfPage;
        },
        totalPage: function () {

            if (typeof this.filteredCouponRows != "undefined") {
                var frlen = this.filteredCouponRows.length;
                if (this.filteredCouponRows.length == null || this.filteredCouponRows.length == 0 || this.filteredCouponRows.length == undefined) {
                    frlen = 0;
                }
                console.log(this.filteredCouponRows.length);

                return Math.ceil(this.filteredCouponRows.length / this.countOfPage);
            } else {
                return 0;
            }
        },
    /*** PAGE ***/

    /** news **/
        filteredRows: function () {
            // 因為 JavaScript 的 filter 有分大小寫，
            // 所以這裡將 filter_name 與 rows[n].name 通通轉小寫方便比對。
            //var filter_name = this.filter_name.toLowerCase();
            var filter_name = this.filter_info.filter_name;

            // 如果 filter_name 有內容，回傳過濾後的資料，否則將原本的 rows 回傳。
            return (this.filter_info.filter_name.trim() !== '') ?
                this.filter_info.filterdata.list.filter(function (d) { return d.subject.toLowerCase().indexOf(filter_name) > -1; }) :
                this.filter_info.filterdata.list;
        },
        filterPageStart: function () {
            return (this.filter_info.currPage - 1) * this.filter_info.countOfPage;
        },
        filterTotalPage: function () {

            if (typeof this.filteredRows !== "undefined") {
                var frlen = this.filteredRows.length;
                if (this.filteredRows.length === null || this.filteredRows.length === 0 || this.filteredRows.length === undefined) {
                    frlen = 0;
                }
                //console.log(this.filteredRows.length);

                return Math.ceil(this.filteredRows.length / this.filter_info.countOfPage);
            } else {
                return 0;
            }


        }


    },
    filters: {
        currency: function (num) {
            return parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").replace(".00", "");
        },
        filterCartItemLength: function (value) {
            return value.filter(item => item.tempProStatus != "Y").length;
        },
        filterProductTotal: function (value) {
            if (!value) return 0
            var total = 0;
            value.map(x => total += (parseInt(x.price) * parseInt(x.qty)))
            //value.map(x => total += (x.price * x.qty))
            cartFormData.proPrice = total;
            return total;
        },
        filterTotal: function (value) {
            if (!value) return 0
            var total = 0;
            value.map(x => total += (x.price * x.qty))

            //運費
            if (cartFormData.freightData.length > 0) {
                for (var i = 0; i < cartFormData.freightData.length; i++) {
                    total += parseInt(cartFormData.freightData[i].data);
                }
            }

            //手續費
            if (cartFormData.payMsg.length > 0) {
                for (var j = 0; j < cartFormData.payMsg.length; j++) {
                    total += parseInt(cartFormData.payMsg[j].data);
                }
            }

            //折扣
            if (discountInfo.discountlist.length > 0) {
                for (var k = 0; k < discountInfo.discountlist.length; k++) {
                    total += parseInt(discountInfo.discountlist[k].data);
                }
            }

            //紅利
            if (bonusInfo.bonuslist.length > 0) {
                for (var k = 0; k < bonusInfo.bonuslist.length; k++) {
                    total += parseInt(bonusInfo.bonuslist[k].data);
                }
            }
            //折價券
            if (couponInfo.couponUsedlist.length > 0) {
                for (var k = 0; k < couponInfo.couponUsedlist.length; k++) {
                    total += parseInt(couponInfo.couponUsedlist[k].data);
                }
            }

            cartFormData.totalPrice = total;
            return total;
        },
        
    }
})




