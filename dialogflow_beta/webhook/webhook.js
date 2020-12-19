const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const fetch = require('node-fetch')
const base64 = require('base-64')
const { response } = require('express')

let username = "";
let password = "";
let token = "";

USE_LOCAL_ENDPOINT = false;
// set this flag to true if you want to use a local endpoint
// set this flag to false if you want to use the online endpoint
ENDPOINT_URL = ""
if (USE_LOCAL_ENDPOINT) {
  ENDPOINT_URL = "http://127.0.0.1:5000"
} else {
  ENDPOINT_URL = "https://mysqlcs639.cs.wisc.edu"
}

async function getToken() {
  let request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + base64.encode(username + ':' + password)
    },
    redirect: 'follow'
  }

  const serverReturn = await fetch(ENDPOINT_URL + '/login', request)
  const serverResponse = await serverReturn.json()
  token = serverResponse.token

  return token;
}

// post agent message
async function addMsg(msg, user) {
  let request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body: JSON.stringify({
      isUser: user,
      text: msg,
    }),
    redirect: 'follow'
  }

  const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/messages', request)
  const serverResponse = await serverReturn.json()
  console.log(serverResponse)
  return serverResponse;
}

// delete msgs to start a new dialog
async function delMsg() {
  let request = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    redirect: 'follow'
  }

  const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/messages', request)
  const serverResponse = await serverReturn.json()
  return serverResponse;
}

async function getQuery(endpoint) {
  let request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow'
  }

  const serverReturn = await fetch(endpoint, request)
  const serverResponse = await serverReturn.json()
  return serverResponse;
}

async function getQueryWToken(endpoint) {
  let request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    redirect: 'follow'
  }

  const serverReturn = await fetch(endpoint, request)
  const serverResponse = await serverReturn.json()
  return serverResponse;
}

async function postQuery(endpoint) {
  let request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    redirect: 'follow'
  }

  const serverReturn = await fetch(endpoint, request)
  const serverResponse = await serverReturn.json()
  console.log(serverResponse)
  return serverResponse;
}

async function deleteQuery(endpoint) {
  let request = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    redirect: 'follow'
  }

  const serverReturn = await fetch(endpoint, request)
  const serverResponse = await serverReturn.json()
  console.log(serverResponse)
  return serverResponse;
}

async function putQuery(endpoint, obj){
  let request = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body: JSON.stringify(obj),
    redirect: 'follow'
  }

  const serverReturn = await fetch(endpoint, request)
  const serverResponse = await serverReturn.json()
  console.log(serverResponse)
  return serverResponse;
}

app.get('/', (req, res) => res.send('online'))
app.post('/', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  async function welcome() {
    agent.add('Webhook works!')
    // post msg to endpoint
    await addMsg("Webhook works!", false)
  }

  async function login() {
    // You need to set this from `username` entity that you declare in DialogFlow
    username = agent.parameters.username;
    // You need to set this from password entity that you declare in DialogFlow
    password = agent.parameters.password;

    await getToken();
    // reset the msg panel and add new message to it
    await delMsg();
    await addMsg(agent.query, true);
    // if log in false
    if (token === undefined || token === "") {
      agent.add("Your username or password might be incorrect! Please try again.");
      await addMsg("Your username or password might be incorrect! Please try again.", false)
    } else {
      agent.add("Welcome " + username + "! What can I do for you today?");
      await addMsg("Welcome " + username + "! What can I do for you today?", false)
    }

    console.log(username)
    console.log(password)
    console.log(token)
  }

  async function getCategory() {
    let categories = await getQuery("https://mysqlcs639.cs.wisc.edu/categories")

    categories = categories.categories
    let response = "We provide a wide variety of items: " + categories.join(', ') + ". Are you looking for a specific type today?";

    agent.add(response)
    await addMsg(agent.query, true)
    await addMsg(response, false)
  }

  async function getTag() {
    let category = agent.parameters.category
    await addMsg(agent.query, true)

    if (category === undefined || category === "") {
      let categories = await getQuery("https://mysqlcs639.cs.wisc.edu/categories")
      categories = categories.categories
      let response = "Sorry. I can only search for tags for a specific category."
      response += " The categories we have are " + categories.join(', ') + ". Please try again!"
      agent.add(response)
      await addMsg(response)
      return
    }

    let tags = await getQuery('https://mysqlcs639.cs.wisc.edu/categories/' + category + '/tags')
    tags = tags.tags
    if (tags === undefined || tags === "") {
      let categories = await getQuery("https://mysqlcs639.cs.wisc.edu/categories")
      categories = categories.categories
      let response = "Sorry. I did not find any tags for " + category
      response += ". Our categories are " + categories.join(', ') + ". Please try again!"
      agent.add(response)
      await addMsg(response)
    } else {
      let response = "Here is what I found."
      if (tags.length > 1) {
        response += "Tags for " + category + " are " + tags.join(', ') + ".";
      } else {
        response += "Tag for " + category + " is " + tags.join(', ') + ".";
      }
      agent.add(response)
      await addMsg(response, false)
    }
  }

  async function getProInfo() {
    // add user's msg
    await addMsg(agent.query, true)
    // check whether provode product name
    let userPro = agent.parameters.product
    if (userPro === undefined || userPro === "") {
      agent.add("Hmmm, I do not understand what product you want to check information for. Please try again!")
      await addMsg("Hmmm, I do not understand what product you want to check information for. Please try again!")
      return
    }

    let products = await getQuery('https://mysqlcs639.cs.wisc.edu/products')
    products = products.products
    // iterate the list of product to search
    let findPro = "";
    for (let curPro of products) {
      if (userPro.toLowerCase() === curPro.name.toLowerCase()) {
        findPro = curPro
        break
      }
    }

    // check whether find the product
    if (findPro === "") {
      agent.add("Sorry. I did not find the product " + userPro + ". Please try it again!")
      await addMsg("Sorry. I did not find the product " + userPro + ". Please try it again!", false)
      return
    }

    // find the product
    let response = "The " + findPro.name + " is 30 dollars without tax.";
    response += "Its description is: " + findPro.description;

    // If the product has reviews, they should be able to inquire about reviews and average ratings.
    let reviews = await getQuery("https://mysqlcs639.cs.wisc.edu//products/" + findPro.id + "/reviews")
    reviews = reviews.reviews

    if (reviews === undefined || reviews === "") {
      // no review, reponse directly
      agent.add(response)
      await addMsg(response, false)
    } else {
      // calculate the average rating
      let sum = 0;
      let num = 0;
      let revTexts = " The reviews of this products are as the following:";
      for (let curReview of reviews) {
        num += 1
        sum += curReview.stars
        revTexts += " " + curReview.text + ". "
      }
      response += " There are " + num + " reviews for this product and it has the average ratings of " + sum / num + " stars."

      agent.add(response + revTexts)
      await addMsg(response + revTexts, false)
      // agent.add(revTexts)
      // await addMsg(revTexts, false)
    }
  }

  async function getCartInfo() {
    await addMsg(agent.query, true)
    // what is in their cart (e.g. total number and type of items, total cost, etc.).
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }

    let cartPro = await getQueryWToken('https://mysqlcs639.cs.wisc.edu/application/products')
    cartPro = cartPro.products

    if (cartPro === undefined || cartPro.length === 0) {
      let response = "Sorry, I did not find anyting in your cart. What about adding some products to it?"
      agent.add(response)
      await addMsg(response, false)
    } else {
      // generate the products info
      let price = 0
      let count = 0
      let names = []
      for (let curPro of cartPro) {
        price += curPro.price * curPro.count
        count += curPro.count
        if (curPro.count > 1) {
          names.push(curPro.count + " " + curPro.name + "s that belong to " + curPro.category)
        } else {
          names.push(curPro.count + " " + curPro.name + " that belongs to " + curPro.category)
        }
      }

      let response = "I am glad to help! Currently, there "
      if (count > 1) {
        response += "are " + count + " products in your cart."
        response += " The total cost is " + price + " dollars without tax."
        response += " The products are "
      } else {
        response += "is " + count + " product in your cart."
        response += " The total cost is " + price + " dollars without tax."
        response += " The product is "
      }
      response += names.join(", ") + "."
      agent.add(response)
      await addMsg(response, false)
    }
  }

  // narrow down with tag
  async function narrowWTag() {
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }
    // add user msg
    await addMsg(agent.query, true)

    let userTag = agent.parameters.tag
    // no tag
    if (userTag === undefined || userTag === "") {
      let response = "Hmmm, I did not understand what tag you want to narrow down your search with. Please try again!"
      agent.add(response)
      await addMsg(response, false)
      return
    }

    // check whether the tag is valid
    let tags = await getQuery("https://mysqlcs639.cs.wisc.edu/tags")
    tags = tags.tags
    let findTag = ""
    for (let curTag of tags) {
      if (userTag.toLowerCase() === curTag.toLowerCase()) {
        findTag = curTag
        break
      }
    }

    if (findTag === "") {
      let response = "Sorry. We do not have the tag " + userTag + " in our database. The tags we have are "
      response += tags.join(", ") + ". Please try again!"

      agent.add(response)
      await addMsg(response, false)
    } else {
      await postQuery("https://mysqlcs639.cs.wisc.edu/application/tags/" + findTag)
      let response = "Got it! The tag " + userTag + " is added to your search!"
      agent.add(response)
      await addMsg(response, false)
    }
  }

  async function removeTag() {
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }
    // add user msg
    await addMsg(agent.query, true)
    let userTag = agent.parameters.tag
    // no tag
    if (userTag === undefined || userTag === "") {
      let response = "Hmmm, I did not understand what tag you want to remove. Please try again!"
      response += "If you want to remove all the tags, you can simply tell me: remove all the tags."
      agent.add(response)
      await addMsg(response, false)
      return
    }

    if (userTag === "all") {
      await deleteQuery("https://mysqlcs639.cs.wisc.edu/application/tags/")
      let response = "Sure. All of your tags are removed from your search!"
      agent.add(response)
      await addMsg(response, false)
      return
    }

    // check whether the tag is valid
    let tags = await getQueryWToken("https://mysqlcs639.cs.wisc.edu/application/tags")
    tags = tags.tags
    let findTag = ""
    for (let curTag of tags) {
      if (userTag.toLowerCase() === curTag.toLowerCase()) {
        findTag = curTag
        break
      }
    }

    if (findTag === "") {
      let response = "Hmmm, it seems like you did not add the tag " + userTag + " before. Please try again!"
      agent.add(response)
      await addMsg(response, false)
    } else {
      await deleteQuery("https://mysqlcs639.cs.wisc.edu/application/tags/" + findTag)
      let response = "Got it! The tag " + userTag + " is removed your search!"
      agent.add(response)
      await addMsg(response, false)
    }
  }

  async function addToCart() {
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }

    // add user msg
    await addMsg(agent.query, true)

    let userPro = agent.parameters.product
    let count = agent.parameters.count
    // no product
    if (userPro === undefined || userPro === "") {
      let response = "Hmmm, I did not understand what product you want to add to cart. Please try again!"
      agent.add(response)
      await addMsg(response, false)
      return
    }

    // check whether the product exists
    let products = await getQuery('https://mysqlcs639.cs.wisc.edu/products')
    products = products.products
    // iterate the list of product to search
    let findPro = "";
    for (let curPro of products) {
      // also consider simple plural with s
      if (userPro.toLowerCase() === curPro.name.toLowerCase() || userPro.substring(0, userPro.length - 1).toLowerCase() === curPro.name.toLowerCase()) {
        findPro = curPro
        break
      }
    }

    if (findPro === "") {
      agent.add("Sorry. I did not find the product " + userPro + ". Please try it again!")
      await addMsg("Sorry. I did not find the product " + userPro + ". Please try it again!", false)
      return
    }

    // add to cart
    if (count === undefined || count === "") {
      // no count specified, add one
      await postQuery('https://mysqlcs639.cs.wisc.edu/application/products/' + findPro.id)
      let response = "I am glad to help! 1 " + userPro + " is added to your cart."
      agent.add(response)
      await addMsg(response, false)
    } else {
      for (let i = 0; i < count; i++) {
        await postQuery('https://mysqlcs639.cs.wisc.edu/application/products/' + findPro.id)
      }
      let response = "I am glad to help! " + count + " " + userPro + " are added to your cart."
      agent.add(response)
      await addMsg(response, false)
    }
  }

  async function removeCart(){
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }

    // add user msg
    await addMsg(agent.query, true)

    let userPro = agent.parameters.product
    let count = agent.parameters.count
    // no product
    if (userPro === undefined || userPro === "") {
      let response = "Hmmm, I did not understand what product you want to add to cart. Please try again!"
      agent.add(response)
      await addMsg(response, false)
      return
    }

    // check whether the product is in the cart
    let products= await getQueryWToken('https://mysqlcs639.cs.wisc.edu/application/products')
    products = products.products

    // iterate the list of product to search
    let findPro = "";
    for (let curPro of products) {
      // also consider simple plural with s
      if (userPro.toLowerCase() === curPro.name.toLowerCase() || userPro.substring(0, userPro.length - 1).toLowerCase() === curPro.name.toLowerCase()) {
        findPro = curPro
        break
      }
    }

    if (findPro === "") {
      let response = "Sorry. It seems like the prodcut " + userPro + " is not added to your cart. Please try it again!"
      agent.add(response)
      await addMsg(response, false)
      return
    }

    // remove from cart
    if (count === undefined || count === "") {
      // no count specified, add one
      await deleteQuery('https://mysqlcs639.cs.wisc.edu/application/products/' + findPro.id)
      let response = "Got it! 1 " + userPro + " is removed from your cart."
      agent.add(response)
      await addMsg(response, false)
    } else {
      if (count > findPro.count){
        //remove more than those in the cart
        let response = "Sorry. It seems like you only have " + findPro.count + " " + findPro.name
        response += "in your cart. I am not able to remove " + count + " of it from your cart. Please try it again!"
        agent.add(response)
        await addMsg(response, false)
        return
      }
      for (let i = 0; i < count; i++) {
        await deleteQuery('https://mysqlcs639.cs.wisc.edu/application/products/' + findPro.id)
      }
      let response = "Got it! " + count + " " + userPro + " are removed your cart."
      agent.add(response)
      await addMsg(response, false)
    }
  }

  async function clearCart(){
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }

    // add user msg
    await addMsg(agent.query, true)

    // clear thing
    await deleteQuery('https://mysqlcs639.cs.wisc.edu/application/products/')
    let response = "Got it! Your cart is cleared."
    agent.add(response)
    await addMsg(response, false)
  }

  async function confirmCart(){
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }

    // add user msg
    await addMsg(agent.query, true)

    // redirect to the confirm page
    let obj= {"page": "/" + username + "/cart-confirmed"}
    await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
    let response = "Got it! Your order is confirmed! Thank you for shopping with us."
    agent.add(response)
    await addMsg(response, false)
  }

  async function reviewCart(){
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }

    // add user msg
    await addMsg(agent.query, true)

    // redirect to the cart review page
    let obj= {"page": "/" + username + "/cart-review"}
    await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)

    let cartPro = await getQueryWToken('https://mysqlcs639.cs.wisc.edu/application/products')
    cartPro = cartPro.products

    let response = ""
    if (cartPro === undefined || cartPro.length === 0) {
      response = "There is no products in your cart. What about adding some products to it?"
      agent.add(response)
      await addMsg(response, false)
    } else {
      // generate the products info
      let price = 0
      let count = 0
      let names = []
      for (let curPro of cartPro) {
        price += curPro.price * curPro.count
        count += curPro.count
        if (curPro.count > 1) {
          names.push(curPro.count + " " + curPro.name + "s that belong to " + curPro.category)
        } else {
          names.push(curPro.count + " " + curPro.name + " that belongs to " + curPro.category)
        }
      }

      response = "Currently, there "
      if (count > 1) {
        response += "are " + count + " products in your cart."
        response += " The total cost is " + price + " dollars without tax."
        response += " The products are "
      } else {
        response += "is " + count + " product in your cart."
        response += " The total cost is " + price + " dollars without tax."
        response += " The product is "
      }
      response += names.join(", ") + "."
    }

    let navigate_response = "Sure. Now, you are at the cart review page. "
    navigate_response += "You can press the confirm button or let me know to confirm your order whenever you are ready. "
    agent.add(navigate_response + response)
    await addMsg(navigate_response + response, false)
  }

  async function navigate(){
    // no token
    if (token === undefined || token === "") {
      agent.add("Hmmm, please log in first!")
      await addMsg("Hmmm, please log in first!", false)
      return
    }

    // add user msg
    await addMsg(agent.query, true)

    let page = agent.parameters.page
    let cat_pro = agent.parameters.cat_pro
    let obj = {}

    if(page === undefined || page === ""){
      // should be go to some category page
      if (cat_pro === undefined || cat_pro === ""){
        let response = "Sorry, I am not able to understand what page you want to go to. Please try again."
        agent.add(response)
        await addMsg(response, false)
        return
      }
      // get all categories and check whether the category exists
      let categories = await getQuery("https://mysqlcs639.cs.wisc.edu/categories")
      categories = categories.categories
      
      let findCat = "";
      for (let curCat of categories) {
        // also consider simple plural with s
        if (cat_pro.toLowerCase() === curCat.toLowerCase()) {
          findCat = curCat
          break
        }
      }

      if (findCat === "" || findCat === undefined) {
        // might be for product
        let products = await getQuery('https://mysqlcs639.cs.wisc.edu/products')
        products = products.products
        // iterate the list of product to search
        let findPro = "";
        for (let curPro of products) {
          if (cat_pro.toLowerCase() === curPro.name.toLowerCase()) {
            findPro = curPro
            break
          }
        }
        if (findPro === "" || findPro === undefined) {
          let response = "Sorry, The category or product " + cat_pro +" seems not to be exist. Please try again."
          agent.add(response)
          await addMsg(response, false)
          return
        }
        // find product, go there
        obj= {"page": "/" + username + '/' + findPro.category + "/products/" + findPro.id}
        await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
        let response = "Sure. Now, you are viewing the page for " + cat_pro + "."
        agent.add(response)
        await addMsg(response, false)
        return
      }

      // find category, go there
      obj= {"page": "/" + username + "/" + findCat}
      await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
      let response = "Sure. Now, you are at the page for " + cat_pro + "."
      agent.add(response)
      await addMsg(response, false)
    }else{
      let response = ""
      // home, sign up, sign in, cart, cart review, cart confirm
      switch(page) {
        case "home":
          obj= {"page": "/" + username}
          await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
          response = "Sure. Now, you are at user home page with all the availabe categories."
          agent.add(response)
          await addMsg(response, false)
          break;
        case "welcome":
          obj= {"page": "/"}
          await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
          response = "Got it. Now, you are viewing the welcome page for the wiscShop. You can sign in or sign up from here."
          agent.add(response)
          await addMsg(response, false)
          break;
        case "sign up":
          obj= {"page": "/signUp"}
          await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
          response = "Sure. Now, you are at the sign up page."
          agent.add(response)
          await addMsg(response, false)
          break
        case "sign in":
          obj= {"page": "/signIn"}
          await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
          response = "Sure. Now, you are at the sign in page."
          agent.add(response)
          await addMsg(response, false)
          break
        case "cart":
          obj= {"page": "/" + username + "/cart"}
          await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
          response = "Sure. Now, you are viewing your shopping cart."
          agent.add(response)
          await addMsg(response, false)
          break
        case "cart-review":
          obj= {"page": "/" + username + "/cart-review"}
          await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
          response = "Sure. Now, you are at the cart review page. You can press the confirm button or let me know to confirm your order whenever you are ready."
          agent.add(response)
          await addMsg(response, false)
          break
        case "cart-confirm":
          obj= {"page": "/" + username + "/cart-confirmed"}
          await putQuery('https://mysqlcs639.cs.wisc.edu/application/',obj)
          response = "Sure. Your order is confirmed! Thanks for shopping with us"
          agent.add(response)
          await addMsg(response, false)
          break
        default:
          response = "Sorry, the page " + page + " does not exists. Please try again!"
          agent.add(response)
          await addMsg(response, false)
      }
    }

  }

  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)
  intentMap.set('logIn', login)
  intentMap.set('requestCategory', getCategory)
  intentMap.set('requestTag', getTag)
  intentMap.set('requestProInfo', getProInfo)
  intentMap.set('getCartInfo', getCartInfo)
  intentMap.set("narrowWTag", narrowWTag)
  intentMap.set("removeTag", removeTag)
  intentMap.set("addToCart", addToCart)
  intentMap.set("removeCart",removeCart)
  intentMap.set("clearCart",clearCart)
  intentMap.set("confirmCart",confirmCart)
  intentMap.set("reviewCart", reviewCart)
  intentMap.set("navigate", navigate)
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)
