# Poster-Server документация по API

## Философия запросов и ответов в Poster
#### Запросы

Точных правил по отправкам запросов нет, все необходимые данные для запроса находятся в документации.
#### Ответы
Все ответы без исключения должны присылать два обязательных ключа, `type` и `payload`.
`type` должен содержать в себе название метода API к которому было совершено обращение, существует шаблон для названия типа: 
* Все типы пишутся заглавными буквами (капсом)
* Каждый тип должен начинаться с префикса `TYPE_`
* Название типа должно повторять название API, например: `TYPE_TEST`, `TYPE_GETUSERINFO`

`payload` должен содержать в себе всю остальную информацию, которую присылает в ответе. 
В `payload` нужно добавлять два обязательных значения `status` которое поможет определить какой результат вернулся, и не прислал ли API ошибку, также, нужно присылать значение `data`, в которое уже помещаются остальные ответные данные, такие как, информация о пользователе, или другая служебная информация
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
	type: "TYPE_TEST", 
    payload: {
	    status: "OK",
        data: {
	        value: "API WORK!"
        }
    }
}
	</code></pre>
</details>


## test
Запрос для обращения: `/api/test`

Тип: GET 

Наименование в ответе: `TYPE_TEST`

Описание: Используется для проверки работы API

Входные данные: НЕТ

<details>
  <summary>Пример запроса</summary>
  <pre><code>
http://localhost:3001/api/test
	</code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
	type: "TYPE_TEST", 
    payload: {
	    status: "OK",
        data: {
	        value: "API WORK!"
        }
    }
}
	</code></pre>
</details>

## createUser
Запрос для обращения: `/api/createUser`

Тип: POST

Наименование в ответе: `TYPE_CREATEUSER`

Описание: Используется для регистрации нового пользователя

Входные данные: ...

<details>
  <summary>Пример запроса</summary>
  <pre><code>
{
	login: *USER_LOGIN*,
	email: *USER_EMAIL*,
	fullname: *USER_FULLNAME*,
	password: *USER_PASSWORD*,
	passwordRepeat: *USER_PASSWORD_REPEAT*
}
	</code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
    type: "TYPE_CREATEUSER", 
    payload: {
	    status: "OK", 
	    data: *SESSION_TOKEN*
    }
}
	</code></pre>
</details>

## loginUser
Запрос для обращения: `/api/loginUser`

Тип: POST

Наименование в ответе: `TYPE_LOGINUSER`

Описание: Используется для авторизации юзера в системе

Входные данные: Электронная почта, Пароль

<details>
  <summary>Пример запроса</summary>
  <pre><code>
{
	email: *USER_EMAIL*,
	password: *USER_PASSWORD*,
}
	</code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
    type: "TYPE_CREATEUSER", 
    payload: {
	    status: "OK", 
	    data: {
			token: *SESSION_TOKEN*,
			login: *USER_LOGIN*
		}
    }
}
	</code></pre>
</details>

## getUserInfo
Запрос для обращения: `/api/getUserInfo`

Тип: GET

Наименование в ответе: `TYPE_GETUSERINFO`

Описание: Используется для получения информации о пользователе

Входные данные: Логин пользователя, Токен пользователя, Токен сессии

<details>
  <summary>Пример запроса</summary>
  <pre><code>
http://localhost:3001/api/getUserInfo?login=*USER_LOGIN*
http://localhost:3001/api/getUserInfo?token=*USER_TOKEN*
http://localhost:3001/api/getUserInfo?session=*USER_SESSION*
	</code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
	type: "TYPE_GETUSERINFO",
	payload: {
		status: "OK",
		data: {
			login: *USER_LOGIN*,
			fullname: *USER_FULLNAME*,
			status: *USER_STATUS*,
			email: *USER_EMAIL*,
			accountInfo: {
				*OTHER_USER_INFO*
			},
			posts: [*USER_POSTS*]
		}
	}
}
	</code></pre>
</details>

## editUserData
Запрос для обращения: `/api/editUserData`

Тип: POST

Наименование в ответе: `TYPE_EDITUSERDATA`

Описание: Используется для изменения данных пользователя

Входные данные: Логин пользователя у которого будут меняться данные, пароль пользователя, глобальные данные, второстепенные данные

<details>
  <summary>Пример запроса</summary>
  <pre><code>
{
    userLogin: *USER_LOGIN*,
	password: *USER_PASSWORD*,
    global: {
		*USER_GLOBAL_DATA*
	},
    other: {
		*USER_OTHER_DATA*
	},
}
  </code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
    type: "TYPE_EDITUSERDATA", 
    payload: {
		status: "OK",
		data: {
			newLogin: *NEW_USER_LOGIN*
		},
	}
}
	</code></pre>
</details>

## editUserPassword
Запрос для обращения: `/api/editUserPassword`

Тип: POST

Наименование в ответе: `TYPE_EDITUSERPASSWORD`

Описание: Используется для изменения пароля пользователя

Входные данные: Логин пользователя у которого будет менять пароль, текущий пароль пользователя, новый пароль пользователя, повторение нового пароля пользователя

<details>
  <summary>Пример запроса</summary>
  <pre><code>
{
    login: *USER_LOGIN*,
    oldPassword: *USER_OLD_PASSWORD*,
    newPassword: *USER_NEW_PASSWORD*,
    newPasswordRepeat: *USER_NEW_PASSWORD_REPEAT*,
}
  </code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
    type: "TYPE_EDITUSERPASSWORD",
    payload: {
        status: "OK",
    },
}
	</code></pre>
</details>

## closeAllSessions
Запрос для обращения: `/api/closeAllSessions`

Тип: POST

Наименование в ответе: `TYPE_CLOSEALLSESSIONS`

Описание: Используется для завершенрия всех активных сессий пользователя

Входные данные: Логин пользователя, пароль пользователя

<details>
  <summary>Пример запроса</summary>
  <pre><code>
{
    login: *USER_LOGIN*,
    password: *USER_PASSWORD*,
}
  </code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
    type: "TYPE_CLOSEALLSESSIONS",
    payload: {
        status: "OK",
    },
}
	</code></pre>
</details>

## deleteAccount
Запрос для обращения: `/api/deleteAccount`

Тип: POST

Наименование в ответе: `TYPE_DELETEACCOUNT`

Описание: Используется для удаления аккаунта

Входные данные: Логин пользователя, пароль пользователя

<details>
  <summary>Пример запроса</summary>
  <pre><code>
{
    login: *USER_LOGIN*,
    password: *USER_PASSWORD*,
}
  </code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
    type: "TYPE_DELETEACCOUNT",
    payload: {
        status: "OK",
    },
}
	</code></pre>
</details>

## publishPost
Запрос для обращения: `/api/publishPost`

Тип: POST

Наименование в ответе: `TYPE_PUBLISHPOST`

Описание: Используется для публикации поста

Входные данные: Логин пользователя, пароль пользователя, Заголовок поста, Содержимое поста, Прикрепленный массив ресурсов ( ! На данный момент не реализовано ! )

Важно: Этот метод API экспериментальный, потому еще может, и скорее всего будет активно меняться!

<details>
  <summary>Пример запроса</summary>
  <pre><code>
{
    login: *USER_LOGIN*,
    password: *USER_PASSWORD*,
    title: *POST_TITLE*,
    message: *POST_MESSAGE*,
	addedResources: [*RESOURCE*]
}
  </code></pre>
</details>
<details>
  <summary>Пример ответа</summary>
  <pre><code>
{
    type: "TYPE_PUBLISHPOST",
    payload: {
    	status: "OK",
    },
}
	</code></pre>
</details>