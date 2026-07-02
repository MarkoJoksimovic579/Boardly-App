import type { CommentPayload } from '@/features/comments/data/commentTypes'
import axios from './config'
import type { BoardPayload } from '@/features/boards/data/boardsTypes'
import type { ListPayload, ReorderListItem } from '@/features/lists/data/listsTypes'
import type {
  DragTaskPayload,
  TaskEditPayload,
  TaskPayload,
} from '@/features/tasks/data/tasksTypes'
import type { RegisterPayload } from '@/features/users/components/RegisterComp.vue'
import type { UserAddPayload } from '@/features/admin/UsersAddComp.vue'
import type { User } from '@/features/users/data/usersMockData'

export default {
  /**
   * =========================
   * AUTH
   * =========================
   */
  loginUser(data: { username: string; password: string }) {
    return axios.post('/auth/login', data)
  },
  registerUser: (payload: RegisterPayload) => axios.post('/auth/register', payload),

  //boards
  getBoards: () => axios.get('boards'),
  addBoards: (payload: BoardPayload, sid: string) =>
    axios.post('boardsById', payload, { params: { sid } }),
  editBoards: (payload: BoardPayload, sid: string) =>
    axios.put('boardsById', payload, { params: { sid } }),
  deleteBoards: (brd_id: number, sid: string) =>
    axios.delete('boardsById', { params: { brd_id, sid } }),

  //favorites

  postFavorites: (brd_id: number, sid: string) =>
    axios.post('favorites', { brd_id }, { params: { sid } }),
  deleteFavorites: (brd_id: number, sid: string) =>
    axios.delete('favorites', { params: { brd_id, sid } }),

  //lists
  getLists: (brd_id: number, sid: string) => axios.get('boardsLists', { params: { brd_id, sid } }),
  addLists: (payload: ListPayload, sid: string) =>
    axios.post('boardsListsById', payload, { params: { sid } }),
  deleteLists: (brd_id: number, list_id: number, sid: string) =>
    axios.delete('boardsListsById', { params: { brd_id, list_id, sid } }),
  editLists: (payload: ListPayload, sid: string) =>
    axios.put('boardsListsById', payload, { params: { sid } }),
  reorderLists: (payload: { lists: ReorderListItem[] }, sid: string) =>
    axios.put('listsReorder', payload, {
      params: { sid },
    }),

  //tasks
  getTaskById: (tsk_id: number, sid: string) => axios.get('tasksById', { params: { tsk_id, sid } }),
  getTasks: (sid: string) => axios.get('tasks', { params: { sid } }),
  postTasks: (payload: TaskPayload, sid: string) =>
    axios.post('tasksById', payload, { params: { sid } }),
  deleteTasks: (tsk_id: number, brd_id: number, sid: string) =>
    axios.delete('tasksById', { params: { tsk_id, brd_id, sid } }),
  editTasks: (payload: TaskEditPayload, sid: string) =>
    axios.put('tasksById', payload, { params: { sid } }),
  reorderTasks: (payload: DragTaskPayload[], sid: string) =>
    axios.put(
      'tasksReorder',
      { tasks: payload },
      {
        params: { sid },
      },
    ),

  //comentsimport axios from 'axios'

  getComments: (tsk_id: number, sid: string) => axios.get('comments', { params: { tsk_id, sid } }),
  addComments: (payload: CommentPayload, sid: string) =>
    axios.post('comments', payload, { params: { sid } }),
  deleteComments: (com_id: number, sid: string) =>
    axios.delete('comments', { params: { com_id, sid } }),

  //labels
  getLabels: (brd_id: number) => axios.get('labels', { params: { brd_id } }),
  postLabels: (brd_id: number, name: string, color: string) =>
    axios.post('labels', { brd_id, name, color }),
  putLabels: (brd_id: number, id: number, name: string, color: string) =>
    axios.put('labels', { brd_id, id, name, color }),
  deleteLabels: (brd_id: number, id: number) => axios.delete('labels', { params: { brd_id, id } }),

  //ADMIN
  getUsers: (sid: string) => axios.get('admin/users', { params: { sid } }),

  deleteUsers: (id: number, sid: string) => axios.delete('admin/users', { params: { id, sid } }),
  postUsers: (payload: UserAddPayload, sid: string) =>
    axios.post('admin/users', payload, { params: { sid } }),
  adminEditUsers: (payload: User, sid: string) =>
    axios.put('admin/users', payload, { params: { sid } }),
  //users

  getUsersById: (id: number, sid: string) => axios.get('usersById', { params: { id, sid } }),
  editUsers: (payload: User, sid: string) => axios.put('usersById', payload, { params: { sid } }),
  //members
  postMembers: (members: number[], brd_id: number, sid: string) =>
    axios.post('members', { members, brd_id }, { params: { sid } }),
  deleteMembers: (brd_id: number, member_id: number, sid: string) =>
    axios.delete('members', { params: { brd_id, member_id, sid } }),
  putMembersRoles: (brd_id: number, usr_id: number, role: 'admin' | 'member') =>
    axios.put(
      'members',
      {},
      {
        params: {
          brd_id,
          usr_id,
          role,
        },
      },
    ),

  //roles
  getRoles: (sid: string) => axios.get('roles', { params: { sid } }),

  //notifications
  getNotifications: () =>
    axios.get('notifications', {
      params: {},
    }),
  putNotificationsRead: () => axios.put('notifications'),
  deleteNotifications: () => axios.delete('notifications'),

  //playboard test
  getPlayBoards: () => axios.get('/vezba/vezba3'),
}
