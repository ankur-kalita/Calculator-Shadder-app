defmodule Backend.ShaderGenerator do
  require Logger

  def generate_shader(prompt) do
    api_key = Application.get_env(:backend, :openai_api_key)
    headers = [
      {"Authorization", "Bearer #{api_key}"},
      {"Content-Type", "application/json"}
    ]

    body = %{
      "model" => "gpt-4o-mini",
      "messages" => [
        %{
          "role" => "system",
          "content" =>
            "You are a webgl shader generator. You will be given a prompt and you will generate the corresponding webgl shader code. Provide only the raw webgl shader code without any Markdown formatting, code fences, comments, or additional text."
        },
        %{"role" => "user", "content" => prompt}
      ]
    }
    |> Jason.encode!()

    case HTTPoison.post("https://api.openai.com/v1/chat/completions", body, headers, [
           timeout: 30_000,
           recv_timeout: 30_000
         ]) do
      {:ok, %HTTPoison.Response{status_code: 200, body: response_body}} ->
        Logger.info("Success response from OpenAI API")
        shader_code = parse_shader_code(response_body)
        Logger.info("Parsed shader code: #{String.slice(shader_code, 0, 100)}...")
        {:ok, shader_code}

      {:ok, %HTTPoison.Response{status_code: status_code, body: error_body}} ->
        Logger.error("API Error: Status #{status_code}, Body: #{error_body}")
        {:error, :api_error}

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error("HTTP Request failed: #{inspect(reason)}")
        {:error, reason}

      other ->
        Logger.error("Unexpected response: #{inspect(other)}")
        {:error, :unexpected_response}
    end
  end

  defp parse_shader_code(body) do
    body
    |> Jason.decode!()
    |> Map.get("choices")
    |> List.first()
    |> Map.get("message")
    |> Map.get("content")
    |> extract_shader_code()
    |> String.trim()
  end

  defp extract_shader_code(content) do
    content
    |> String.replace(~r/```(?:glsl|hlsl|shaderlab)?\n?/, "")
    |> String.replace("```", "")
  end
end
