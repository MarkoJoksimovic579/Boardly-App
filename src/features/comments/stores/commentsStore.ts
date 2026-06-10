import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Comment, CommentPayload } from '../data/commentTypes'
import api from '@/api'

export const useCommentsStore = defineStore('comments', () => {
  const commentsList = ref<Comment[]>([])

  const searchText = ref('')

  const filteredComments = computed(() => {
    let result = commentsList.value
    if (searchText.value !== '') {
      result = commentsList.value.filter((comment) =>
        comment.text.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase().trim()),
      )
    }

    return result
  })

  async function fetchComments(tsk_id: number, sid: string) {
    try {
      const res = await api.getComments(tsk_id, sid)
      const data = res.data.data

      commentsList.value = data as Comment[]
    } catch (err) {
      console.log(err)
    }
  }

  async function postComment(payload: CommentPayload, sid: string) {
    try {
      const res = await api.addComments(payload, sid)
      const data = res.data.data

      console.log('com id je ', data)
    } catch (err) {
      console.log(err)
    }
  }

  async function eraseComment(id: number, sid: string) {
    try {
      const res = await api.deleteComments(id, sid)
      const data = res.data.data

      console.log('com id je ', data)
    } catch (err) {
      console.log(err)
    }
  }

  return { commentsList, fetchComments, postComment, eraseComment, filteredComments, searchText }
})
