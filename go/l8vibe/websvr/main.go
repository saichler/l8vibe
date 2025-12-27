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

package main

import (
	"os"

	"github.com/saichler/l8types/go/ifs"
	"github.com/saichler/l8types/go/types/l8api"
	"github.com/saichler/l8types/go/types/l8health"
	"github.com/saichler/l8types/go/types/l8web"
	"github.com/saichler/l8utils/go/utils/ipsegment"
	"github.com/saichler/l8vibe/go/l8vibe/common"
	"github.com/saichler/l8vibe/go/l8vibe/consts"
	"github.com/saichler/l8vibe/go/l8vibe/project"
	types2 "github.com/saichler/l8vibe/go/types"
	"github.com/saichler/l8web/go/web/server"
	"github.com/saichler/layer8/go/overlay/health"
	"github.com/saichler/layer8/go/overlay/vnic"
)

func main() {
	resources := common.Resources("l8vibe-websvr-"+os.Getenv("HOSTNAME"), consts.VNET_PORT)
	resources.Logger().SetLogLevel(ifs.Info_Level)
	startWebServer(resources)
}

func startWebServer(resources ifs.IResources) {
	serverConfig := &server.RestServerConfig{
		Host:           ipsegment.MachineIP,
		Port:           consts.WEBSITE_PORT,
		Authentication: true,
		CertName:       consts.WEBSITE_CERT,
		Prefix:         consts.WEBSITE_PREFIX,
	}

	svr, err := server.NewRestServer(serverConfig)
	if err != nil {
		panic(err)
	}

	nic := vnic.NewVirtualNetworkInterface(resources, nil)
	nic.Resources().SysConfig().KeepAliveIntervalSeconds = 60
	nic.Start()
	nic.WaitForConnection()

	registerTypes(resources)

	hs, ok := nic.Resources().Services().ServiceHandler(health.ServiceName, 0)
	if ok {
		ws := hs.WebService()
		svr.RegisterWebService(ws, nic)
	}

	project.Activate(nic)

	sla := ifs.NewServiceLevelAgreement(&server.WebService{}, ifs.WebService, 0, false, nil)
	sla.SetArgs(svr)
	nic.Resources().Services().Activate(sla, nic)

	nic.Resources().Logger().Info("Web Server Started!")
	resources.Logger().SetLogLevel(ifs.Error_Level)

	common.WebServer = svr.(*server.RestServer)
	server.Timeout = 600
	server.Method = ifs.M_Proximity

	svr.Start()
}

func registerTypes(resources ifs.IResources) {
	resources.Registry().Register(&l8api.L8Query{})
	resources.Registry().Register(&l8health.L8Top{})
	resources.Registry().Register(&l8web.L8Empty{})
	resources.Registry().Register(&types2.Project{})
	resources.Registry().Register(&types2.ProjectList{})
	resources.Introspector().Inspect(&types2.Project{})
}
