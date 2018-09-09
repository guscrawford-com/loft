
process.on('message',(message:any)=>{
    message.execute();
});
export * from './loft';