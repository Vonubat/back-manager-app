import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import * as boardService from '../services/board.service';
import { checkBody, createError, defineErrorResponse } from '../services/error.service';


export const getBoards = async (_: Request, res: Response) => {
  try {
    const foundedBoards = await boardService.findBoards();
    res.json(foundedBoards);
  } catch (err) {
    console.log(err);
  }
};

export const getBoardById = async (req: Request, res: Response) => {

  try {
    const foundedBoards = await boardService.findBoardById(req.params['boardId']);
    res.json(foundedBoards);
  }
  catch (err) {
    return res.status(404).send(createError(404, 'Board was not founded!'));
  }

};

export const createBoard = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const bodyError = checkBody(req.body, ['title', 'description', 'owner', 'users'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }

  const { title, description, owner, users } = req.body;
  try {
    const newBoard = await boardService.createBoard({ title, owner, users, description }, guid, initUser);
    res.json(newBoard);
  }
  catch (err) { return console.log(err); } 

};

export const updateBoard = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const bodyError = checkBody(req.body, ['title', 'description', 'owner', 'users'])

  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }

  const { title, description, owner, users } = req.body;

  try {
    const updatedBoard = await boardService.updateBoard(req.params['boardId'], { title, description, owner, users }, guid, initUser);
    res.json(updatedBoard);
  } catch (err) { 
    const error = err as Error
    const { code, message } = defineErrorResponse(error, 'BOARD');

   return res.status(code).send(createError(code, message ));
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  try {
    const deletedBoard = await boardService.deleteBoardById(req.params['boardId'], guid, initUser);
    res.json(deletedBoard);
  } catch (err) {
    const error = err as Error
    const { code, message } = defineErrorResponse(error, 'BOARD');

   return res.status(code).send(createError(code, message ));
  }
};