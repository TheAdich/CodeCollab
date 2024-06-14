const router=require('express').Router();
const {createRoom,joinRoom,getAllRooms,getRoomById,saveCode,getRoomByName}=require('../controllers/roomController');
router.post('/createroom',createRoom);
router.post('/joinroom',joinRoom);
router.get('/getroombyid',getRoomById)
router.get('/getallrooms',getAllRooms);
router.put('/savecode',saveCode);
router.post('/getroombyname',getRoomByName);
module.exports = router;