// function wrapAsync(fn){
//     return function(next,req,res){
//         fn(next,req,res).catch(next);
//     }
// }
//basically wrapasync function ahe jya madeh ekk func fn as a para pass kelay where ha func return pan ekk function kartoy jyache para are (next,req,res) and hya func madhe to vercha func which was passed as a para is exicuted 
//by passing same para next req,res where jer kahi errro ala ter for error handling .catch(next);  okk this is it >>>

// (fn)=>{
//     return (next,req,res)=>{
//         fn(next,req,res).catch(next);
//     }
// }  modern way to write it 


 module.exports=(fn)=>{
    return (next,req,res)=>{
        fn(next,req,res).catch(next);
    }
}  
