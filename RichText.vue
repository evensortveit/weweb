<template>
  <div class="editor-container">
    <editor-content :editor="editor" class="prose" />
    <bubble-menu v-if="editor" :editor="editor" class="bubble-menu">
      <button @click="addComment" class="comment-button">Add Comment</button>
    </bubble-menu>
    <div class="comments-sidebar" ref="commentsRef">
      <div v-if="comments.length === 0" class="no-comments">No comments yet</div>
      <div
        v-else
        v-for="comment in comments"
        :key="comment.id"
        :class="['comment-item', { active: comment.id === activeCommentId }]"
      >
        <input
          v-model="comment.content"
          :id="`comment-${comment.id}`"
          @blur="updateComment(comment.id, comment.content)"
          placeholder="Enter comment..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

defineOptions({ name: 'RichText' })
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CommentExtension from '@sereneinserenade/tiptap-comment-extension'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  supabaseUrl: { type: String, required: true },
  supabaseKey: { type: String, required: true },
  documentId: { type: String, required: true },
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const supabase = createClient(props.supabaseUrl, props.supabaseKey)

const comments = ref([])
const activeCommentId = ref(null)
const commentsRef = ref(null)

const editor = new Editor({
  extensions: [
    StarterKit,
    CommentExtension.configure({
      HTMLAttributes: { class: 'my-comment' },
      onCommentActivated: (commentId) => {
        activeCommentId.value = commentId
        if (commentId) {
          setTimeout(() => {
            const input = commentsRef.value?.querySelector(`#comment-${commentId}`)
            input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            input?.focus()
          }, 100)
        }
      }
    })
  ],
  content: props.modelValue,
  onUpdate: () => {
    emit('update:modelValue', editor.getJSON())
  }
})

watch(
  () => props.modelValue,
  newContent => {
    const current = editor.getJSON()
    if (JSON.stringify(newContent) !== JSON.stringify(current)) {
      editor.commands.setContent(newContent)
    }
  }
)

onMounted(async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('document_id', props.documentId)
  if (!error) comments.value = data
})

const addComment = async () => {
  const id = uuidv4()
  const newComment = {
    id,
    document_id: props.documentId,
    content: '',
    created_at: new Date().toISOString()
  }
  const { error } = await supabase.from('comments').insert(newComment)
  if (!error) {
    comments.value.push(newComment)
    editor.commands.setComment(id)
    activeCommentId.value = id
  }
}

const updateComment = async (id, content) => {
  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
  if (error) console.error(error)
}
</script>

<style>
.editor-container { display: flex; gap: 20px; }
.prose { flex: 1; padding: 20px; border: 1px solid #ccc; }
.comments-sidebar { width: 300px; padding: 20px; border: 1px solid #ccc; overflow-y: auto; }
.comment-item { margin-bottom: 10px; padding: 10px; border: 1px solid #eee; }
.comment-item.active { border-color: blue; }
.bubble-menu { background: white; padding: 5px; border: 1px solid #ccc; border-radius: 5px; }
.comment-button { padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
.my-comment { background: yellow; cursor: pointer; }
.no-comments { text-align: center; color: gray; }
</style>
