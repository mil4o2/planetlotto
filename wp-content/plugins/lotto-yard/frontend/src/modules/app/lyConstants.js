angular.module('lyApp.constants', [])
    .constant('lyConstants', {

        devMode: LY_Settings.devMode,
        maintenanceMode: LY_Settings.maintenanceMode,
        ipAddress: LY_Settings.ipAddress,

        apiUrl: LY_Settings.adminAjaxUrl,
        siteUrl: LY_Settings.siteUrl,
        homeUrl: LY_Settings.homeUrl,

        selectPageSlug: LY_Settings.selectPageSlug,

        blogPageSlug: LY_Settings.blogPageSlug,
        blogCategoriesSlug: LY_Settings.categoryBlogSlug,
        blogTagsSlug: LY_Settings.tagBlogSlug,

        thankYouPageSlug: LY_Settings.thankYouPageSlug,
        myAccountPageSlug: LY_Settings.myAccountPageSlug,
        promotionsPageSlug: LY_Settings.promotionsPageSlug,
        cartPageSlug: LY_Settings.cartPage,
        billingPageSlug: LY_Settings.billingPage,

        partialPath: LY_Settings.partialPath,
        langPath: LY_Settings.langPath,

        affiliateId: LY_Settings.affiliateId,

        currentLanguage: LY_Settings.siteCurrentLang,
        siteLanguages: LY_Settings.siteLanguages,

        currency: LY_Settings.siteCurrency,

        //products: LY_Settings.products,

        /**
         * products below is for localhost use
         */
        products: [
            {
                "Name": "Personal",
                "id": "1",
                "lotteryTypeId": ""
            },
            {
                "Name": "PersonalGroup",
                "id": "2",
                "lotteryTypeId": ""
            },
            {
                "Name": "Group",
                "id": "3",
                "lotteryTypeId": ""
            },
            {
                "Name": "Gold",
                "id": "4",
                "lotteryTypeId": ""
            },
            {
                "Name": "TopLottoGroup",
                "id": "14",
                "lotteryTypeId": ""
            },
            {
                "Name": "VIP24_7",
                "id": "18",
                "lotteryTypeId": ""
            },
            {
                "Name": "SixPack",
                "id": "29",
                "lotteryTypeId": ""
            },
            {
                "Name": "SProduct",
                "id": "666",
                "lotteryTypeId": ""
            }
        ],

        lotteriesInfo: LY_Settings.lotteriesInfo,

        paymentSystems: LY_Settings.paymentSystems,

        processActionTypes: LY_Settings.processActionTypes,

        pageTemplates: LY_Settings.pageTemplates,

        translationObject: translationObject,

        errorMessagesObject: errorMessagesObject,

        transactionItemsPerPage: [10, 20, 50],

        sharesOptions: [1, 2, 5],

        groupTickets: [50, 100, 200], // TODO get from API

        sharesMaxValue: 150, // TODO get from API

        playPageGroupViews: [{
            type: 'small',
            tickets: 50,
        }, {
            type: 'medium',
            tickets: 100,
        }, {
            type: 'large',
            tickets: 200,
        }],

        wpApiDefinitions: {
            getPageByName: LY_Settings.wpRestUrl + 'wp/v2/pages?slug=',
            getPageById: LY_Settings.wpRestUrl + 'wp/v2/pages/',
            getAllTestimonials: LY_Settings.wpRestUrl + 'wp/v2/testimonials',
            getAlllatestWinners: LY_Settings.wpRestUrl + 'wp/v2/latestWinners',
            getallBlogsPerPage: LY_Settings.wpRestUrl + 'wp/v2/news?per_page=',
            getSingleNewsByName: LY_Settings.wpRestUrl + 'wp/v2/news?slug=',
            getPromotionsPerPage: LY_Settings.wpRestUrl + 'wp/v2/promotions?per_page=',
            getSinglePromotionByName: LY_Settings.wpRestUrl + 'wp/v2/promotions?slug=',
            getMenuByLocation: LY_Settings.wpRestUrl + 'wp-api-menus/v2/menu-locations/',
            getAcfOptions: LY_Settings.wpRestUrl + 'acf/v2/options',
            getGravityForms: LY_Settings.homeUrl + '/gravityformsapi/',

            getAllPosts: LY_Settings.wpRestUrl + 'wp/v2/posts?_embed',
            getAllCategories: LY_Settings.wpRestUrl + 'wp/v2/categories',
            getAllTags: LY_Settings.wpRestUrl + 'wp/v2/tags',
            getPostsByCategories: LY_Settings.wpRestUrl + 'wp/v2/posts/?categories=',
            getPostsByTags: LY_Settings.wpRestUrl + 'wp/v2/posts/?tags=',
            getSinglePostByName: LY_Settings.wpRestUrl + 'wp/v2/posts/?slug=',
        },

        lyApiDefinitions: {
            globalinfo: '/?path=globalinfo/',
            mailservice: '/?path=mailservice/',
            cashier: '/?path=cashier/',
            playlottery: '/?path=playlottery/',
            userinfo: '/?path=userinfo/',
            countryprocessor: '/?path=countryprocessor/',
            // backoffice: '/?path=' + LY_Settings.lyRestUrl + 'backoffice/',
            backoffice: '/?path=backoffice/'
        },

        gravityFormsKeys: {
            publicKey: "c253ccd1cd",
            privateKey: "258c18b3f6cc61b"
        }
    });
