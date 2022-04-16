<template>
   <vee-form :validation-schema="schema" @submit="register" :initial-values="userData">
    <!--Alert Message-->
    <div class="text-white text-center font-bold p-5 mb-4" v-if="reg_show_alert" :class="reg_alert_variant">{{reg_alert_message}}</div>
      <!-- Name -->
      <div class="mb-3">
        <label class="inline-block mb-2">Name</label>
        <vee-field
          type="text"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Name"
          name="name"
        />
        <!-- The errorMessage name field-->
        <ErrorMessage class="text-red-600" name="name"/>
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
          name="email"
        />
        <!-- The errorMessage for emailfield-->
        <ErrorMessage class="text-red-600" name="email"/>
      </div>
      <!-- Age -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <vee-field
          type="number"
          name="age"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        />
          <!-- The errorMessage for Age field-->
        <ErrorMessage class="text-red-600" name="age"/>
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field  type="password"
          name="password" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded" placeholder="Password" />
          <!-- :bails="false" v-slot="{field, errors}"> -->

          <!-- we want to show multiple errors in this case-->
        <!-- <input class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password" type="password" v-bind="field">
          <div class="text-red-600" v-for="error in errors" :key="error">{{error}}</div> -->

          <!-- The errorMessage for paswword field-->
        <ErrorMessage class="text-red-600" name="password"/>
      </div>
      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Confirm Password</label>
        <vee-field
          type="password"
          name="confirm_password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password"
        />
          <!-- The errorMessage for confirmed password field-->
        <ErrorMessage class="text-red-600" name="confirm_password"/>
      </div>
      <!-- Country -->
      <div class="mb-3">
        <label class="inline-block mb-2">Country</label>
        <vee-field as="select" name="country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="USA">USA</option>
          <option value="Mexico">Nigeria</option>
          <option value="Germany">Ghana</option>
        </vee-field>
        <ErrorMessage class="text-red-600" name="country"/>
      </div>
      <!-- TOS -->
      <div class="mb-3 pl-6">
        <vee-field type="checkbox" class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        name="tos" value="1"/>
        <label class="inline-block">Accept terms of service</label>
        <ErrorMessage class="text-red-600 block" name="tos"/>
      </div>
      <button
        type="submit"
        :disabled="reg_in_submission"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded
        transition hover:bg-purple-700"
      >
        Submit
      </button>
  </vee-form>
</template>

<script>

export default {
  name: 'RegistrationView',

  data() {
    return {
      // adding the rule.
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:3|max:100',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required',
        tos: 'tos',
      },
      // default value for the country
      userData: {
        country: 'USA',
      },
      // Alert box message.
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_message: 'Please wait! your account is being created',
    };
  },
  methods: {
    async register(values) {
      // for toggling alert visibiltity
      this.reg_show_alert = true;
      // disable the form button
      this.reg_in_submission = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_message = 'Please wait! your account is being created.';

      // firebase
      try {
        // This will allow us to access the action function we created. The firest argument is the name of the action function.
        // The secton argument is optional, it is the payload that would be pass unto the function
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_message = 'An unexcpected error occured. Please try again later.';
        return;
      }

      // submitting the form.
      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_message = 'Success! Your account has been created.';
      window.location.reload();
    },
  },

};
</script>

<style>

</style>
