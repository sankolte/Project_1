
const listing=require("./models/listing.js");
const review = require("./models/review.js");


function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {

        //redirect ka flow build karna he
        //so what we will do is ekk variable banake usko session ke under store kerr detee req.sessions.redirectUrl=req.orignalUrl;
        //tohbfir kya hoga usse ki whenever i want to use this rediecturl me use kar sakata hu coz session ka access to sab ke pass hoga hi na 
        //abb me login route me direct redirect(/lisitngs)ki jagahh redirect("req.session.redirectUrl");
        //but udhar passport ke vajahe se problem ayega this is crazr key concept 
        //what passport (passport.authenticate) will do in /login route is it wiill reset the whole session after user log in that what passport does usak he ekk property aisa 
        // to ye extar info stored in session will be gone and console.log(req.session.redirectUrl) mull ayegaa>>

        // tohh usse acha iska kuch alag aur ekk middleware banate 
        //jaha req.session.redirectUrl hum store karte locals me coz session usko nahi access karega


        req.session.redirectUrl = req.originalUrl;


        req.flash("error", "User must be logged in");
        return res.redirect("/login");
    }
    next();
}

// module.exports = { isLoggedIn };



function saveRedirectUrl(req,res,next){
    if( req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();

}

// module.exports={isLoggedIn,saveRedirectUrl};





async function isOwner(req,res,next){

            let {id}=req.params;

    
           let list= await listing.findById(id);
       
           if(!list.owner.equals(req.user._id)){                           //basically sabse pehele id nikala and then usko check kiya ki jo owner he wo current user ke same he ya nahi 
                req.flash("error","user is not authorised");
                return res.redirect(`/listings/${id}`);                          //return kiya coz firr ageke cheese exicute honge nhi to fir we know return ends the fuc  

           }
           next();

}

// module.exports={isLoggedIn,saveRedirectUrl,isOwner};



async function isReviewAuthor(req,res,next){

           let { id, reviewId } = req.params;
            let r=await review.findById(reviewId);
            console.log(r);
            // console.log(list2.author);
            if(!r.author.equals(req.user._id)){
                 req.flash("error","user is not authorised");
                  return res.redirect(`/listings/${id}`);  //coz redirect to wo apna ho he perticular listing wala page uspe h hoga ma >>>  

            }
            next();

}

module.exports={isLoggedIn,saveRedirectUrl,isOwner,isReviewAuthor};