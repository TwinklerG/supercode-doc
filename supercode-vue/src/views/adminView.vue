<script setup lang="ts">
import { onMounted, ref, reactive,computed } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import {
  getUserData,
  createUser,
  changeUserData,
  deleteUser,
  type UserInfo,
} from '../api/mgr/user';
import {
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  type ProblemData,
} from '../api/mgr/problem';

const users = ref<Map<string, UserInfo>>(new Map());
const activeUser = ref('');
const userFormRefs = reactive(new Map());
const isEditUser = ref(false);

const usersArray = computed(() => Array.from(users.value.entries()));
const problemsArray = computed(() => Array.from(problems.value.entries()));

const newUser = reactive({
  username: '',
  password: '',
  email: '',
  nickname: '',
});

// 获取自身信息判断权力
onMounted(async () => {
  try {
    const res = await getUserData();
    if (res.data.code !== 200 || (res.data.data?.role !== 'admin')) {
      ElMessage.error('无管理员权限');
    }
  } catch (error) {
    ElMessage.error(String(error));
  }
});

const handleCreateUser = async () => {
  try {
    await createUser(newUser);
    ElMessage.success('用户创建成功');
  } catch (e) {
    ElMessage.error('用户创建失败');
  }
};

const handleUpdateUser = async (formEl: FormInstance | null, user: UserInfo) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        await changeUserData(user);
        ElMessage.success('修改成功');
      } catch (e) {
        ElMessage.error('修改失败');
      }
    }
  });
};

const handleDeleteUser = async (username: string) => {
  const user = users.value.get(username);
  if (user?.role !== 'user') {
    ElMessage.warning('只能删除普通用户');
    return;
  }
  try {
    await deleteUser(username);
    users.value.delete(username);
    ElMessage.success('删除成功');
  } catch (e) {
    ElMessage.error('删除失败');
  }
};

onMounted(async () => {
  try {
    const res = await getUserData();
    if (res.data.code !== 200 || (res.data.data?.role !== 'admin')) {
      ElMessage.error('无管理员权限');
    } else {
      // 拉取题目数据
      const problemRes = await getProblem();
      if (problemRes.data.code === 200 && Array.isArray(problemRes.data.data)) {
        const problemMap = new Map<string, ProblemData>();
        problemRes.data.data.forEach((p: ProblemData & { id: string }) => {
          problemMap.set(p.id, p);
        });
        problems.value = problemMap;
      } else {
        ElMessage.error('获取题目失败');
      }
    }
  } catch (error) {
    ElMessage.error(String(error));
  }
});
// 题目管理
const problems = ref<Map<string, ProblemData>>(new Map());
const activeProblemId = ref('');
const newProblem = reactive<ProblemData>({
  title: '',
  description: '',
  example_stdio: [['', '', '']],
  stdio: [['', '', '']],
});

const handleCreateProblem = async () => {
  try {
    await createProblem(newProblem);
    ElMessage.success('题目创建成功');
  } catch (e) {
    ElMessage.error('题目创建失败');
  }
};

const handleUpdateProblem = async (id: string) => {
  const problem = problems.value.get(id);
  if (problem) {
    try {
      await updateProblem({ problemId: id, ...problem });
      ElMessage.success('题目更新成功');
    } catch (e) {
      ElMessage.error('更新失败');
    }
  }
};

const handleDeleteProblem = async (id: string) => {
  try {
    await deleteProblem(id);
    problems.value.delete(id);
    ElMessage.success('删除成功');
  } catch (e) {
    ElMessage.error('删除失败');
  }
};

</script>

<template>
  <div class="p-4 space-y-6">
    <!-- 用户管理 -->
    <section>
      <h2 class="text-xl font-bold mb-2">用户管理</h2>
      <el-form inline>
        <el-form-item label="用户名"><el-input v-model="newUser.username" /></el-form-item>
        <el-form-item label="密码"><el-input type="password" v-model="newUser.password" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="newUser.email" /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="newUser.nickname" /></el-form-item>
        <el-form-item><el-button type="primary" @click="handleCreateUser">添加用户</el-button></el-form-item>
      </el-form>

      <el-divider />

      <div v-for="([username, user]) in usersArray" :key="username" class="border p-4 rounded mb-4">
        <el-form :model="user" :ref="(el: FormInstance | null) => userFormRefs.set(username, el)">
          <el-form-item label="用户名"><el-input v-model="user.username" disabled /></el-form-item>
          <el-form-item label="昵称"><el-input v-model="user.nickname" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="user.email" /></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdateUser(userFormRefs.get(username), user)">保存</el-button>
            <el-button type="danger" @click="handleDeleteUser(username)" class="ml-2">删除</el-button>
          </el-form-item>
        </el-form>
      </div>


    </section>

    <!-- 题目管理 -->
    <section>
      <h2 class="text-xl font-bold mb-2">题目管理</h2>
      <el-form inline>
        <el-form-item label="题目"><el-input v-model="newProblem.title" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="newProblem.description" /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreateProblem">添加题目</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div v-for="([id, problem]) in problemsArray" :key="id" class="border p-4 rounded mb-4">
        <el-form :model="problem">
          <el-form-item label="标题"><el-input v-model="problem.title" /></el-form-item>
          <el-form-item label="描述"><el-input v-model="problem.description" /></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdateProblem(id)">保存</el-button>
            <el-button type="danger" class="ml-2" @click="handleDeleteProblem(id)">删除</el-button>
          </el-form-item>
        </el-form>
      </div>

    </section>
  </div>
</template>

<style scoped>
</style>