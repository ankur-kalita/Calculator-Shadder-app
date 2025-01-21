defmodule BackendWeb.ShaderController do
  use BackendWeb, :controller

  alias Backend.ShaderGenerator

  def create(conn, %{"prompt" => prompt} = _params) do
    case ShaderGenerator.generate_shader(prompt) do
      {:ok, shader_code} ->
        conn
        |> put_status(:ok)
        |> json(%{shader: shader_code})

      {:error, :api_error} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Failed to generate shader code from OpenAI API."})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: "An unexpected error occurred: #{inspect(reason)}"})
    end
  end
end
