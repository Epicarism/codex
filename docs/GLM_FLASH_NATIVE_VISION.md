# Codex GLM: native GLM-5.3 Flash vision

## Status

The stock Codex host exposes `view_image` only when the selected `ModelInfo`
contains `InputModality::Image`. GLM-5.3-Flash supports native image input, but
the GLM static catalog previously omitted the model. With the catalog entry
below, Codex selects Flash and sends attached image turns directly through the
GLM Responses adapter.

The Codex protocol currently accepts `text | image | audio` in
`InputModality`; it does not yet model `video`. Native GLM video is therefore
handled through `glm-see --video-url`, not `view_image`.

## Required static model metadata

```json
{
  "slug": "glm-5.3-flash",
  "display_name": "GLM-5.3 Flash",
  "description": "Z.ai GLM-5.3-Flash through the local Codex GLM Responses adapter. Native multimodal model supporting text and image input.",
  "default_reasoning_level": "none",
  "supported_reasoning_levels": [
    { "effort": "none", "description": "Fast native multimodal GLM" }
  ],
  "input_modalities": ["text", "image"],
  "context_window": 1000000,
  "max_context_window": 1000000,
  "max_output_tokens": 131072
}
```

Use the containing model's normal GLM instruction/template metadata and copy
this model into `glm-models-catalog.json`. The GLM tap repairs
`models_cache.json` from that catalog on startup.

## Verification

1. `codex debug models` must show `glm-5.3-flash` with `"image"` input.
2. Attach a local image and require exact text/shapes/colors:
   `codex exec -i test.png -`
3. In a fresh session, ask the model to call `view_image` on an image it has
   not otherwise seen and require exact grounded details. The session JSONL must
   contain a `view_image` function call and `input_image` function output.

## Known limitation

Codex serializes tool result images into model-visible requests through the
provider adapter. A GLM adapter that receives only an `[image omitted]` session
transcript cannot reconstruct pixels; native image attachment works because the
image URL remains present in the prompt input. Do not claim `view_image` is
fixed without checking the adapter receives the actual `image_url` payload.
