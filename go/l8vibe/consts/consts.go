/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 *
 * Layer 8 Ecosystem is licensed under the Apache License, Version 2.0.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package consts

const (
	VNET_PORT                      = uint32(23333)
	WEBSITE_PORT                   = 1443
	WEBSITE_PREFIX                 = "/l8vibe/"
	WEBSITE_CERT                   = "/data/l8vibe"
	ANTHROPIC_HOST                 = "api.anthropic.com"
	ANTHROPIC_API                  = "https://" + ANTHROPIC_HOST + "/v1/messages"
	ANTHROPIC_HEADER_API_KEY       = "x-api-key"
	ANTHROPIC_HEADER_VERSION       = "anthropic-version"
	ANTHROPIC_HEADER_VERSION_VALUE = "2023-06-01"
	ANTHROPIC_MODEL                = "claude-sonnet-4-20250514"
	ANTHROPIC_ENV                  = "ANTHROPIC_API_KEY"
)
