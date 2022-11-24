import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import * as boardService  from '../services/board.service';
import * as columnService from '../services/column.service';
import { checkBody, createError, defineErrorResponse } from '../services/error.service';


export const getColumns = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];
  if (!ObjectId.isValid(boardId)) {
    return res.status(400).send(createError(400, "BOARD_ID_IS_INVALID"));
  }
  const board = await boardService.findBoardById(boardId);
  if (!board) return res.status(404).send(createError(404, "BOARD_DOES_NOT_EXIST"));
  try {
    const foundedColumns = await columnService.findColumns({ boardId });
    res.json(foundedColumns);
  } catch (err) {
    const error = err as Error;

    if (error.message) return res.status(404).send(createError(404, error.message));
  
    console.log(err);
    
    return res.status(500).send(createError(500, 'SERVER_ERROR'));
  }
};

export const getColumnById = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];

  if (!ObjectId.isValid(boardId)) {
    return res.status(400).send(createError(400, "BOARD_ID_IS_INVALID"));
  }

  if (!ObjectId.isValid(req.params['columnId'])) {
    return res.status(400).send(createError(400, "COLUMN_ID_IS_INVALID"));
  }

  try {
    const foundColumn = await columnService.findColumnById(req.params['columnId']);

    if (!foundColumn) {
      throw new Error("NOT_EXIST");
    }
    
    res.json(foundColumn);
  }
  catch (err) {
    const error = err as Error;
    const { code, message } = defineErrorResponse(error, 'COLUMN');

    res.status(code).send(createError(code, message));
  }

};

export const createColumn = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const boardId = req.baseUrl.split('/')[2];
  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }

  const { title, order } = req.body;
  if (!ObjectId.isValid(boardId)) return res.status(400).send(createError(400, 'BOARD_ID_IS_INVALID'));

  const board = await boardService.findBoardById(boardId);
  if (!board) return res.status(404).send(createError(404, 'BOARD_DOES_NOT_EXIST'));

  try {
    const newColumn = await columnService.createColumn({ title, order, boardId }, guid, initUser);
    res.json(newColumn);
  }
  catch (err) { 
    const error = err as Error;

    if (error.message) {
      return res.status(404).send(createError(404, error.message));
    }

    console.log(err);
    res.status(500).send(createError(500, 'SERVER_ERROR'));
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }
  const { title, order } = req.body;

  try {
    const updatedColumn = await columnService.updateColumn(req.params['columnId'], { title, order }, guid, initUser)
    res.json(updatedColumn);
  }
  catch (err) {
    const error = err as Error;
    const { code, message } = defineErrorResponse(error, 'COLUMN');

    return res.status(code).send(createError(code, message));
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  try {
    const deletedColumn = await columnService.deleteColumnById(req.params['columnId'], guid, initUser);
    res.json(deletedColumn);
  } catch (err) {
    const error = err as Error;
    const { code, message } = defineErrorResponse(error, 'COLUMN');

    return res.status(code).send(createError(code, message));
  }
};